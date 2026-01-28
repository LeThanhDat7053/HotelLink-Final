/* ========= INFORMATION ============================
	- document:  Actions
	- author:    Dmytro Lobov
	- url:       https://dayes.dev
	- email:     d@dayes.dev
==================================================== */

'use strict';


let btnType = document.querySelectorAll('.sticky-buttons a[data-type]');

for (let i = 0; i < btnType.length; ++i) {
    btnType[i].addEventListener('click', btnAction);
}


function btnAction(e) {
    e.preventDefault();
    let type = this.dataset.type;
    let url = window.location.href;
    let title = document.title;

    let popupWidth = 550;
    let popupHeight = 450;
    let topPosition = (screen.height - popupHeight) / 2;
    let leftPosition = (screen.width - popupWidth) / 2;
    let popup = 'width=' + popupWidth + ', height=' + popupHeight + ', top=' + topPosition + ', left=' + leftPosition +
        ', scrollbars=0, resizable=1, menubar=0, toolbar=0, status=0';

    let shareUrl;

    switch (type) {
        case 'print':
            window.print();
            break;
        case 'back':
            window.history.back();
            break;
        case 'forward':
            window.history.forward();
            break;
        case 'facebook':
            shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'vk':
            shareUrl = 'http://vk.com/share.php?url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'twitter':
            shareUrl = 'https://twitter.com/share?url=' + url + '&text=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'linkedin':
            shareUrl = 'https://www.linkedin.com/shareArticle?url=' + url + '&title=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'odnoklassniki':
            shareUrl = 'http://ok.ru/dk?st.cmd=addShare&st._surl=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'googleplus':
            shareUrl = 'https://plus.google.com/share?url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'pinterest':
            shareUrl = 'https://pinterest.com/pin/create/button/?url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'xing':
            shareUrl = 'https://www.xing.com/spi/shares/new?url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'myspace':
            shareUrl = 'https://myspace.com/post?u=' + url + '&t=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'weibo':
            shareUrl = 'http://service.weibo.com/share/share.php?url=' + url + '&title=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'buffer':
            shareUrl = 'https://buffer.com/add?text=' + title + '&url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'stumbleupon':
            shareUrl = 'http://www.stumbleupon.com/submit?url=' + url + '&title=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'reddit':
            shareUrl = 'http://www.reddit.com/submit?url=' + url + '&title=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'tumblr':
            shareUrl = 'https://www.tumblr.com/widgets/share/tool?canonicalUrl=' + url + '&title=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'blogger':
            shareUrl = 'https://www.blogger.com/blog-this.g?u=' + url + '&n=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'livejournal':
            shareUrl = 'http://www.livejournal.com/update.bml?subject=' + title + '&event=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'pocket':
            shareUrl = 'https://getpocket.com/save?url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'telegram':
            shareUrl = 'https://telegram.me/share/url?url=' + url + '&text=' + title;
            window.open(shareUrl, null, popup);
            break;
        case 'skype':
            shareUrl = 'https://web.skype.com/share?url=' + url;
            window.open(shareUrl, null, popup);
            break;
        case 'email':
            shareUrl = 'mailto:?subject=' + title + '&body=' + url;
            window.open(shareUrl, null, popup);
            break;

    }

}
