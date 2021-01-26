const URL = "@@URL";

// function getQueryParams(url) {
//     var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
//     var obj = {};
//     if (!queryString) {
//         return obj;
//     }
//     queryString = queryString.split('#')[0];
//     var arr = queryString.split('&');
//     for (var i = 0; i < arr.length; i++) {
//         var a = arr[i].split('=');
//         var paramName = a[0];
//         var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
//         paramName = paramName.toLowerCase();
//         if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
//         if (paramName.match(/\[(\d+)?\]$/)) {
//             var key = paramName.replace(/\[(\d+)?\]/, '');
//             if (!obj[key]) obj[key] = [];
//             if (paramName.match(/\[\d+\]$/)) {
//                 var index = /\[(\d+)\]/.exec(paramName)[1];
//                 obj[key][index] = paramValue;
//             } else {
//                 obj[key].push(paramValue);
//             }
//         } else {
//             if (!obj[paramName]) {
//                 obj[paramName] = paramValue;
//             } else if (obj[paramName] && typeof obj[paramName] === 'string') {
//                 obj[paramName] = [obj[paramName]];
//                 obj[paramName].push(paramValue);
//             } else {
//                 obj[paramName].push(paramValue);
//             }
//         }
//     }
//     return obj;
// }

$(document).ready(function () {
    $("#add_params").click(function () {
        const urlValue = $("#add_url").val();

        if (!urlValue) return;

        chrome.storage.sync.set({ queryParams: urlValue }, function () {
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                function (tabs) {
                    const tab = tabs[0];

                    // 这里有一个坑的地方，如果用 encode 处理，就会跳转 chrome 协议的地址
                    var tabUrl = tab.url && tab.url.split('?')[0];

                    //   const currentUrl = getQueryParams(tabUrl);
                    //   const newUrlValue = new URLSearchParams(urlValue);

                    //   // 如果有重复key 值就不添加 todo
                    //   if (Object.keys(currentUrl).indexOf(Object.fromEntries(newUrlValue)) < -1) {
                    //     return;
                    //   }

                    var newUrl = `${tabUrl}?${urlValue}`;

                    chrome.tabs.update(tab.id, {
                        url: newUrl,
                        highlighted: true,
                    });
                }
            );
        });
    });

    $("#cancel_params").click(function () {
        $("#add_url").val("");

        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            function (tabs) {
                const tab = tabs[0];

                var tabUrl = tab.url && tab.url.split('?')[0];

                // 后面要将初始进来的 url 保存，撤销的时候就恢复
                var newUrl = `${tabUrl}`;

                chrome.tabs.update(tab.id, {
                    url: newUrl,
                    highlighted: true,
                });
            }
        );
    });

    chrome.storage.sync.get(URL, (res) => {
        console.log(res, "???");
        if (!res.queryParams) {
            return;
        }
        $("#add_url").val(res.queryParams);
    });
});
