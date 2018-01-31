/**
 * Created by xmmrh on 2017/11/28.
 */
function FileProgress(file) {
    this.fileItemID = file.id;
    this.file = file;
    this.$fileItem = $('#'+this.fileItemID);
    if(!this.$fileItem.length){
        var fileSize = plupload.formatSize(file.size).toUpperCase();
        this.$fileItem = $('<tr></tr>');
        var $fileItem = this.$fileItem;
        $fileItem.attr('id',this.fileItemID);
        var filename = file.name;
        if(filename.length>8){
            filename = '...'+filename.slice(-8);
        }
        var $td1 = $('<td><span>'+filename+'</span></td>');
        var $td2 = $('<td class="hidden-xs">'+fileSize+'</td>');
        var $td3 = $('<td/>');
        var $divPro = $('<div/>');
        $divPro.addClass('progress file-progress');
        var $divProBar = $('<div/>');
        $divProBar.addClass('progress-bar progress-bar-success progress-bar-striped active')
            .attr('role', 'progressbar')
            .attr('aria-valuemax', 100)
            .attr('aria-valuenow', 0)
            .attr('aria-valuein', 0)
            .width('0%');
        var $proBarSpan = $('<span class="sr-only" />');
        $proBarSpan.text(fileSize);
        var $divSpan = $('<span class="up-speed"/>');
        var $proCancel = $('<a href=javascript:; />');
        $proCancel.show().addClass('progressCancel').text('x');
        $divProBar.append($proBarSpan);
        $divPro.append($divProBar).append($divSpan);
        $td3.append($divPro);
        $fileItem.append($td1).append($td2).append($td3);
        userParam.$tbody.append($fileItem);
    }
};

FileProgress.prototype.setProgress = function(percentage,speed){
    var file = this.file;
    var uploaded = file.loaded;

    var size = plupload.formatSize(uploaded).toUpperCase();
    var formatSpeed = plupload.formatSize(speed).toUpperCase();
    var $progressbar = this.$fileItem.find('td .progress').find(
        '.progress-bar');
    this.$fileItem.find('.up-speed').text("已上传: " + size + " 上传速度： " +
        formatSpeed + "/s");
    percentage = parseInt(percentage, 10);
//        if (file.status !== plupload.DONE && percentage === 100) {
//            percentage = 99;
//        }
    $progressbar.attr('aria-valuenow', percentage).css('width', percentage + '%');
};

FileProgress.prototype.setStatus = function(status, isUploading) {
    if (!isUploading) {
        this.$fileItem.find('.up-speed').text(status);
    }
};
FileProgress.prototype.setComplete = function (file,key,res) {
    var imgView = '?imageView2/2/w/200';
    var $td1 = this.$fileItem.find('td:eq(0)');
    var $td3 = this.$fileItem.find('td:eq(2)');
    var $img = $('<div class="img"><img src="'+key+imgView+'" alt="" /></div>');
    var $imgDiv = $('<div class="img-box"></div>');
    $td1.append($imgDiv.append($img));
    var $detailDiv = $('<div class="detail"/>');
    var spanStr = `<span class="span-text"><strong class="wrap-block">访问路径：</strong><a href="`+key+`" target="_blank">`
        +key+`</a></span><button class="btn btn-success btn-xs float-r" onclick="copyUrl(this)">复制</button>`;
    $detailDiv.html(spanStr);
    $td3.empty().append($detailDiv);
    $('.instruction').removeClass("hidden");
    $img.find('img').on('load',function(){
        var imageInfo = Qiniu.imageInfo(res.key);
        var $p = $('<div><p>宽:'+imageInfo.width+'</p><p>高:'+imageInfo.height+'</p></div>');
        $img.append($p);
    });
};
FileProgress.prototype.setError = function(err,errTip,up){
    var $td3 = this.$fileItem.find('td:eq(2)');
    var text = errTip;
    if(err.status == 614){
        text = "自定义图片名称已被使用，请更改";
    }
    var $div = $('<div class="text-msg">'+text+'</div>');
    $td3.empty().append($div);
};
