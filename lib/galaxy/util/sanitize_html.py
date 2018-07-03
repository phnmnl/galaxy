"""
HTML Sanitizer (lists of acceptable_* ripped from feedparser)
"""
import bleach

_acceptable_elements = ['a', 'abbr', 'acronym', 'address', 'area', 'article',
        'aside', 'audio', 'b', 'big', 'blockquote', 'br', 'button', 'canvas',
        'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command',
        'datagrid', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir',
        'div', 'dl', 'dt', 'em', 'event-source', 'fieldset', 'figure',
        'footer', 'font', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'hr', 'i', 'img', 'input', 'ins', 'keygen', 'kbd', 'label', 'legend',
        'li', 'm', 'map', 'menu', 'meter', 'multicol', 'nav', 'nextid', 'ol',
        'output', 'optgroup', 'option', 'p', 'pre', 'progress', 'q', 's',
        'samp', 'section', 'select', 'small', 'sound', 'source', 'spacer',
        'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody',
        'td', 'textarea', 'time', 'tfoot', 'th', 'thead', 'tr', 'tt', 'u', 'ul',
        'var', 'video', 'noscript']

_acceptable_attributes = ['abbr', 'accept', 'accept-charset', 'accesskey',
        'action', 'align', 'alt', 'autocomplete', 'autofocus', 'axis',
        'background', 'balance', 'bgcolor', 'bgproperties', 'border',
        'bordercolor', 'bordercolordark', 'bordercolorlight', 'bottompadding',
        'cellpadding', 'cellspacing', 'ch', 'challenge', 'char', 'charoff',
        'choff', 'charset', 'checked', 'cite', 'class', 'clear', 'color',
        'cols', 'colspan', 'compact', 'contenteditable', 'controls', 'coords',
        'data', 'datafld', 'datapagesize', 'datasrc', 'datetime', 'default',
        'delay', 'dir', 'disabled', 'draggable', 'dynsrc', 'enctype', 'end',
        'face', 'for', 'form', 'frame', 'galleryimg', 'gutter', 'headers',
        'height', 'hidefocus', 'hidden', 'high', 'href', 'hreflang', 'hspace',
        'icon', 'id', 'inputmode', 'ismap', 'keytype', 'label', 'leftspacing',
        'lang', 'list', 'longdesc', 'loop', 'loopcount', 'loopend',
        'loopstart', 'low', 'lowsrc', 'max', 'maxlength', 'media', 'method',
        'min', 'multiple', 'name', 'nohref', 'noshade', 'nowrap', 'open',
        'optimum', 'pattern', 'ping', 'point-size', 'prompt', 'pqg',
        'radiogroup', 'readonly', 'rel', 'repeat-max', 'repeat-min', 'replace',
        'required', 'rev', 'rightspacing', 'rows', 'rowspan', 'rules', 'scope',
        'selected', 'shape', 'size', 'span', 'src', 'start', 'step', 'summary',
        'suppress', 'tabindex', 'target', 'template', 'title', 'toppadding',
        'type', 'unselectable', 'usemap', 'urn', 'valign', 'value', 'variable',
        'volume', 'vspace', 'vrml', 'width', 'wrap', 'xml:lang']


def sanitize_html(htmlSource):
    return bleach.clean(htmlSource, tags=_acceptable_elements, attributes=_acceptable_attributes, strip=True)
