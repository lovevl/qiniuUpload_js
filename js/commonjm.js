/**
 * Created by xmmrh on 2017/11/28.
 */
$(function () {
    $('.min-height').css('min-height',client().height-30 + "px");
    param = {
        $path : $('#path_id'),
        $name : $('#name_id'),
        path : null,
        name : null,
        a : ['1','F','3','d','V','m','R','J','y','0'],
        b : ['a','b','c','4','e','f','g','h','i','j'],
        c : ['k','l','6','n','o','p','q','r','s','t'],
        d : ['u','v','w','x','9','z','A','B','C','D'],
        e : ['E','2','G','H','I','8','K','L','M','N'],
        f : ['O','P','Q','7','S','T','U','5','W','X'],
        g : ['2','n','I','Y','6','Z','B','P','Y','Z']
    };
    userParam = {
        $table : $("#tableBox"),
        $tbody : $('#upfileTbody')
    };


    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式，依次退化
        browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
        // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
        // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
        // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
//        uptoken : 'vd5AoY8OV4q7GYaKg6g1b5z1pwImCQmcR7GH_EtF:FU2SjEOzoFC9bhYti2DCDr8n89A=:eyJzY29wZSI6InhtbXJoLXBpYyIsImRlYWRsaW5lIjoxNTExOD'
//            +'Q1NDAxfQ==',
        // uptoken是上传凭证，由其他程序生成
        uptoken_url: 'http://104.199.248.200/jm/qiniu/jmup.jspx',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
        // uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
        //    // do something
        //    return uptoken;
        // },
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
        // downtoken_url: '/downtoken',
        // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
        //unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
        // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://jm.imge.top/',     // bucket域名，下载资源时用到，必需
        container: 'upload_id',             // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: '10mb',             // 最大文件体积限制
        flash_swf_url: 'js/sdk/plupload/Moxie.swf',  //引入flash，相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: true,                     // 开启可拖曳上传
        drop_element: 'upload_id',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '5mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        //x_vars : {
        //    查看自定义变量
        //    'time' : function(up,file) {
        //        var time = (new Date()).getTime();
        // do something with 'time'
        //        return time;
        //    },
        //    'size' : function(up,file) {
        //        var size = file.size;
        // do something with 'size'
        //        return size;
        //    }
        //},
        init: {
            'FilesAdded': function(up, files) {
                userParam.$table.show();
                plupload.each(files, function(file) {
                    // 文件添加进队列后，处理相关的事情
                    var progress = new FileProgress(file,
                        'fsUploadProgress');
                    progress.setStatus("等待...");

                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前，处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时，处理相关的事情
//                var chunk_size = plupload.parseSize(this.getOption(
//                    'chunk_size'));
//                console.log(file.percent);
//                console.log(plupload.formatSize(file.loaded).toUpperCase());
//                console.log(plupload.formatSize(file.speed).toUpperCase());
                // console.log(file.size);
                var progress = new FileProgress(file);
                progress.setProgress(file.percent + "%", file.speed);
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后，处理相关的事情
                // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 查看简单反馈
                // var domain = up.getOption('domain');
                var res = JSON.parse(info.response);
                var sourceLink = up.settings.domain + res.key; //获取上传成功后的文件的Url
                var progress = new FileProgress(file);
                progress.setComplete(file,sourceLink,res);
            },
            'Error': function(up, err, errTip) {
                //上传出错时，处理相关的事情
                console.log(errTip);
                console.log(up);
                console.log(err);
            },
            'UploadComplete': function() {
                //队列文件处理完毕后，处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在unique_names: false，save_key: false时才生效
                var afterfix = file.name.substring(file.name.lastIndexOf("."));
                var key = getJPGname() + afterfix;
                // console.log(key);
                // do something with key here
                return key;
            }
        }

    });

});


function getJPGname() {
    var key;
    param.path = param.$path.val()==''?null:param.$path.val();
    param.name = param.$name.val()==''?null:param.$name.val();
    if(param.path != null && param.name != null){
        key = param.path + '/' +param.name + '/' +randomJPGname();
    }else if(param.path != null && param.name == null){
        key = param.path + '/' +randomJPGname();
    }else if(param.path == null && param.name != null){
        key = param.name + '/' +randomJPGname();
    }else if(param.path == null && param.name == null){
        key = randomJPGname(5);
    }
    return key;
};

function randomJPGname(initNum=3,r=param) {
    var numM = Math.random();
    var num = numM.toString();
    var aa = parseInt(num.charAt(3));
    var bb = parseInt(num.charAt(5));
    var cc = parseInt(num.charAt(7));
    var dd = parseInt(num.charAt(9));
    var ee = parseInt(num.charAt(11));
    var ff = parseInt(num.charAt(13));
    var gg = parseInt(num.charAt(15));
    var arr = [r.a[aa],r.b[bb],r.c[cc],r.d[dd],r.e[ee],r.f[ff],r.g[gg]];
    arr.sort(function () {
        return (0.5-Math.random());
    });
    return arr.slice(0,initNum).join("");
};



var copyUrl = function (obj) {
    var $obj = $(obj);
    var spanTxt = $obj.prev().find('a')[0];
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(spanTxt);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy");
    var $alert = $obj.parent().find('.alert');
    if(!$alert.length){
        var $alert = $('<span class="alert alert-info alert-copy" role="alert">复制成功!</span>');
        $obj.parent().append($alert);
    }else {
        $alert.attr('style','opacity:1');
    }
    var leader = 1.5;
    var alertTimer = window.setInterval(function () {
        leader = leader + (0-leader)/35;
        if(leader<0.1){
            leader = 0;
            window.clearInterval(alertTimer);
        }
        $alert.attr('style','opacity:'+leader);
    },30);
};
