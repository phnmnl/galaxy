define("mvc/history/history-model",["exports","mvc/history/history-contents","mvc/history/history-preferences","mvc/base/controlled-fetch-collection","utils/utils","mvc/base-mvc","utils/localization"],function(t,e,n,i,r,s,o){"use strict";function u(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(t,"__esModule",{value:!0});var c=u(e),a=(u(n),u(i)),d=u(r),l=u(s),h=u(o),f=Backbone.Model.extend(l.default.LoggableMixin).extend(l.default.mixin(l.default.SearchableModelMixin,{_logNamespace:"history",UPDATE_DELAY:4e3,defaults:{model_class:"History",id:null,name:"Unnamed History",state:"new",deleted:!1,contents_active:{},contents_states:{}},urlRoot:Galaxy.root+"api/histories",contentsClass:c.default.HistoryContents,searchAttributes:["name","annotation","tags"],searchAliases:{title:"name",tag:"tags"},initialize:function(t,e){e=e||{},this.logger=e.logger||null,this.log(this+".initialize:",t,e),this.contents=new this.contentsClass([],{history:this,historyId:this.get("id"),order:e.order}),this._setUpListeners(),this._setUpCollectionListeners(),this.updateTimeoutId=null},_setUpListeners:function(){return this.on({error:function(t,e,n,i,r){this.clearUpdateTimeout()},"change:id":function(t,e){this.contents&&(this.contents.historyId=e)}})},_setUpCollectionListeners:function(){return this.contents?this.listenTo(this.contents,{error:function(){this.trigger.apply(this,jQuery.makeArray(arguments))}}):this},contentsShown:function(){var t=this.get("contents_active"),e=t.active||0;return e+=this.contents.includeDeleted?t.deleted:0,e+=this.contents.includeHidden?t.hidden:0},nice_size:function(){var t=this.get("size");return t?d.default.bytesToString(t,!0,2):(0,h.default)("(empty)")},toJSON:function(){return _.extend(Backbone.Model.prototype.toJSON.call(this),{nice_size:this.nice_size()})},get:function(t){return"nice_size"===t?this.nice_size():Backbone.Model.prototype.get.apply(this,arguments)},ownedByCurrUser:function(){return!(!Galaxy||!Galaxy.user)&&(!Galaxy.user.isAnonymous()&&Galaxy.user.id===this.get("user_id"))},numOfUnfinishedJobs:function(){var t=this.get("non_ready_jobs");return t?t.length:0},numOfUnfinishedShownContents:function(){return this.contents.runningAndActive().length||0},_fetchContentRelatedAttributes:function(){var t=["size","non_ready_jobs","contents_active","hid_counter"];return this.fetch({data:$.param({keys:t.join(",")})})},refresh:function(t){var e=this;t=t||{};var n=this.lastUpdateTime;return this.contents.allFetched=!1,(0!==this.contents.currentPage?function(){return e.contents.fetchPage(e.contents.currentPage)}:function(){return e.contents.fetchUpdated(n)})().done(function(n,i,r){var s;try{s=new Date(r.getResponseHeader("Date"))}catch(t){}e.lastUpdateTime=s||new Date,e.checkForUpdates(t)})},checkForUpdates:function(t){var e=this;t=t||{};var n=this.UPDATE_DELAY;if(this.id){var i=function(){e.clearUpdateTimeout(),e.updateTimeoutId=setTimeout(function(){e.refresh(t)},n)};this.numOfUnfinishedShownContents()>0?i():this._fetchContentRelatedAttributes().done(function(t){e.numOfUnfinishedJobs()>0?i():e.trigger("ready")})}},clearUpdateTimeout:function(){this.updateTimeoutId&&(clearTimeout(this.updateTimeoutId),this.updateTimeoutId=null)},stopPolling:function(){this.clearUpdateTimeout(),this.contents&&this.contents.stopPolling()},parse:function(t,e){var n=Backbone.Model.prototype.parse.call(this,t,e);return n.create_time&&(n.create_time=new Date(n.create_time)),n.update_time&&(n.update_time=new Date(n.update_time)),n},fetchWithContents:function(t,e){var n=this;return(t=t||{}).view="dev-detailed",this.fetch(t).then(function(t){return n.contents.history=n,n.contents.setHistoryId(t.id),n.fetchContents(e)})},fetchContents:function(t){t=t||{};var e=this;return e.lastUpdateTime=new Date,e.contents.fetchCurrentPage(t)},_delete:function(t){return this.get("deleted")?jQuery.when():this.save({deleted:!0},t)},purge:function(t){return this.get("purged")?jQuery.when():this.save({deleted:!0,purged:!0},t)},undelete:function(t){return this.get("deleted")?this.save({deleted:!1},t):jQuery.when()},copy:function(t,e,n){if(t=void 0===t||t,!this.id)throw new Error("You must set the history ID before copying it.");var i={history_id:this.id};t&&(i.current=!0),e&&(i.name=e),n||(i.all_datasets=!1),i.view="dev-detailed";var r=this,s=jQuery.post(this.urlRoot,i);return t?s.then(function(t){return new f(t).setAsCurrent().done(function(){r.trigger("copied",r,t)})}):s.done(function(t){r.trigger("copied",r,t)})},setAsCurrent:function(){var t=this,e=jQuery.getJSON(Galaxy.root+"history/set_as_current?id="+this.id);return e.done(function(){t.trigger("set-as-current",t)}),e},toString:function(){return"History("+this.get("id")+","+this.get("name")+")"}})),g=a.default.InfinitelyScrollingCollection,p=g.extend(l.default.LoggableMixin).extend({_logNamespace:"history",model:f,order:"update_time",limitOnFirstFetch:10,limitPerFetch:10,initialize:function(t,e){e=e||{},this.log("HistoryCollection.initialize",t,e),g.prototype.initialize.call(this,t,e),this.includeDeleted=e.includeDeleted||!1,this.currentHistoryId=e.currentHistoryId,this.setUpListeners()},urlRoot:Galaxy.root+"api/histories",url:function(){return this.urlRoot},setUpListeners:function(){return this.on({"change:deleted":function(t){this.debug("change:deleted",this.includeDeleted,t.get("deleted")),!this.includeDeleted&&t.get("deleted")&&this.remove(t)},copied:function(t,e){this.setCurrent(new f(e,[]))},"set-as-current":function(t){var e=this.currentHistoryId;this.trigger("no-longer-current",e),this.currentHistoryId=t.id}})},_buildFetchData:function(t){return _.extend(g.prototype._buildFetchData.call(this,t),{view:"dev-detailed"})},_buildFetchFilters:function(t){var e=g.prototype._buildFetchFilters.call(this,t)||{},n={};return this.includeDeleted?n.deleted=null:(n.deleted=!1,n.purged=!1),_.defaults(e,n)},fetchFirst:function(t){var e=this,n=$.when();return this.currentHistoryId&&(n=g.prototype.fetchFirst.call(e,{silent:!0,limit:1,filters:{purged:"",deleted:"","encoded_id-in":this.currentHistoryId}})),n.then(function(){return t=t||{},t.offset=0,e.fetchMore(t)})},comparators:_.extend(_.clone(g.prototype.comparators),{name:l.default.buildComparator("name",{ascending:!0}),"name-dsc":l.default.buildComparator("name",{ascending:!1}),size:l.default.buildComparator("size",{ascending:!1}),"size-asc":l.default.buildComparator("size",{ascending:!0})}),sort:function(t){var e=(t=t||{}).silent,n=this.remove(this.get(this.currentHistoryId));return g.prototype.sort.call(this,_.defaults({silent:!0},t)),this.unshift(n,{silent:!0}),e||this.trigger("sort",this,t),this},create:function(t,e,n,i){var r=this;return jQuery.getJSON(Galaxy.root+"history/create_new_current").done(function(t){r.setCurrent(new f(t,[],n||{}))})},setCurrent:function(t,e){return e=e||{},this.unshift(t,e),this.currentHistoryId=t.get("id"),e.silent||this.trigger("new-current",t,this),this},toString:function(){return"HistoryCollection("+this.length+",current:"+this.currentHistoryId+")"}});t.default={History:f,HistoryCollection:p}});