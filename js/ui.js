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
        var $td1 = $('<td>'+file.name+'</td>');
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
FileProgress.prototype.setComplete = function (file,key) {
    var imgView = '?imageView2/0/w/200/h/200';
    var $td1 = this.$fileItem.find('td:eq(0)');
    var $td3 = this.$fileItem.find('td:eq(2)');
    var imgDiv = '<div class="img-box"><img src="'+key+imgView+'" alt="" /></div>';
    $td1.html($td1.text()+imgDiv);
    var $detailDiv = $('<div class="detail"/>');
    var spanStr = `<span class="span-text"><strong>访问路径：</strong><a href="`+key+`" target="_blank">`
        +key+`</a></span><button class="btn btn-success btn-xs" onclick="copyUrl(this)">复制</button>`;
    $detailDiv.html(spanStr);
    $td3.empty().append($detailDiv);
};