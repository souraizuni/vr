var today = new Date();
if (typeof($.datepicker) != "undefined") {
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd'
    }).regional["zh-TW"]; //全局設置日期格式
}

function chk_url() {
    var URL = document.location.toString();
    var QueryString = "";
    if (URL != "" && URL.lastIndexOf("?") != -1) {
        //  console.log(URL);
        QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length);
        tmpArr = QueryString.split("&");
        //  console.log(" tmpArr=" + tmpArr);
        for (i = 0; i <= tmpArr.length; i++) {
            var re = new RegExp("(.*)=(.*)", "ig");
            eval(re.exec(tmpArr[i]));
            try {
                eval(RegExp.$1 + "=" + "'" + decodeURI(RegExp.$2) + "'");
                //  eval(tmpArr[i]);
            } catch (e) {
                /*  var re = new RegExp("(.*)=(.*)", "ig");
                 re.exec(tmpArr[i]);
                 try {                  
                     eval(RegExp.$1 + "=" + "'" + decodeURI(RegExp.$2) + "'");
                 } catch (e) {} */
            }
        }
    }
}

function isDate(x) {
    return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate);
}

function count_day(sDT, eDT) { // 日期相減
    var qty = dateDiff(sDT, eDT, "d");
    return qty;
}

function showerror2(err) {
    if (typeof err != 'string') {
        err = err.responseText;
    }
    alert(err);
    if (err.search(/XMLHttpRequest/i) == -1) {
        alert('error2:' + err);
    }
}

//****************產生GUID   
// function G() {
//     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
// }

// function newguid() {
//     return (G() + G() + G() + G() + G() + G() + G() + G());
// }
//****************產生GUID   
function G() {
    return (Math.floor((Math.random() * 10)));
    // return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function newguid($n = 8) { // 產生亂數
    $g = "";
    for ($i = 0; $i < $n; $i++) {
        $g += G();
    }
    return ($g);
    // return (G() . G() . G() . G() . G() . G() . G() . G());
}
//****************

//--輔助數值輸入僅能輸入數值(0x48~0x57)與 ,左移動(0x37),右移動(0x39) 符號
var key_flag = true; //是否有keypress事件觸發, 由 ctrlchangeEvt 事件接收決定是離開事件    
function NumIntKeyPress(e, len) {
    flag = false;
    var obj = e.srcElement || e.target;
    if (obj.value == '') {
        key_flag = true;
        return key_flag;
    }

    var dot = obj.value.indexOf(".");
    len = (typeof(len) == "undefined") ? 0 : len;
    var key = e.keyCode || e.which;
    if (key == 8 || key == 9 || (key >= 37 && key <= 40)) //這裡為了兼容Firefox的backspace,tab,del,方向鍵
    {
        flag = true;
    }

    if (key <= 57 && key >= 48) { //數字
        if (obj.className == 'NumInt_R') {
            if (dot == -1) //沒有小數點
                flag = true;
            else if (obj.value.length <= dot + len) //小數位數
                flag = true;
            else if ((key == 46) && len > 0 && dot == -1) //小數點
                flag = true;
        } else flag = true;

    }
    key_flag = flag;
    return flag;
}

String.prototype.trim = function() {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

//字串擴充方法: 字串格式字串(yyy/mm/dd)轉成日期
String.prototype.Todate = function() {
    try {
        if (this.trim() == '') {
            return null;
        }
        var dateArr = this.split('/');
        dateArr[0] = (parseInt(dateArr[0], 10) + 1911).toString();
        datestr = dateArr[0] + '/' + dateArr[1] + '/' + dateArr[2];
        return new Date(datestr);
    } catch (ex) {
        return null;
    }
}

String.format = function(src) {
    if (arguments.length == 0) {
        return null;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
};

function dateDiff(sDate, eDate, interval = 'd') { // 日期相減
    var dtStart = new Date(sDate);
    var dtEnd = new Date(eDate);
    if (isNaN(dtStart)) return 0;
    if (isNaN(dtEnd)) return 0;
    switch (interval) {
        case "s":
            return parseInt((dtEnd - dtStart) / 1000);
        case "n":
            return parseInt((dtEnd - dtStart) / 60000);
        case "h":
            return parseInt((dtEnd - dtStart) / 3600000);
        case "d":
            return parseInt((dtEnd - dtStart) / 86400000);
        case "w":
            return parseInt((dtEnd - dtStart) / (86400000 * 7));
        case "m":
            return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
        case "y":
            return dtEnd.getFullYear() - dtStart.getFullYear();
    }
}
/* 
Date.prototype.dateDiff = function(interval, objDate) {
    var dtEnd = new Date(objDate);
    if (isNaN(dtEnd)) return undefined;
    switch (interval) {
        case "s":
            return parseInt((dtEnd - this) / 1000);
        case "n":
            return parseInt((dtEnd - this) / 60000);
        case "h":
            return parseInt((dtEnd - this) / 3600000);
        case "d":
            return parseInt((dtEnd - this) / 86400000);
        case "w":
            return parseInt((dtEnd - this) / (86400000 * 7));
        case "m":
            return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
        case "y":
            return dtEnd.getFullYear() - this.getFullYear();
    }
  var sDT = new Date("2004/05/20 07:30:00");
var eDT = new Date("2005/05/20 08:32:02");
document.writeln("秒差 : "+sDT.dateDiff("s",eDT)+"<br>");
document.writeln("分差 : "+sDT.dateDiff("n",eDT)+"<br>");
document.writeln("時差 : "+sDT.dateDiff("h",eDT)+"<br>");
document.writeln("日差 : "+sDT.dateDiff("d",eDT)+"<br>");
document.writeln("週差 : "+sDT.dateDiff("w",eDT)+"<br>");
document.writeln("月差 : "+sDT.dateDiff("m",eDT)+"<br>");
document.writeln("年差 : "+sDT.dateDiff("y",eDT)+"<br>"); 
}
*/

function GM_Replace(str, findstr, replacestr) {
    var index = str.indexOf(findstr);
    while (index != -1) {
        str = str.replace(findstr, replacestr);
        index = str.indexOf(findstr);
    }
    return str;
}

var errorDateMsg = "不是正確的日期，請輸入民國年，如 : 097/01/01 或 0970101 ";

function checkDate_alert(aEvent) // 檢查日期格式(回應訊息)
{
    var aObj = $(aEvent.target);
    bDateCheck = true;
    var dateVal = aObj.val().trim();
    if (dateVal == '') {
        return true;
    }

    if (dateVal.length == 7) //判斷為沒有分隔符號('/')的正確日期，如0970911，則自動幫他補('/')
    {
        aObj.val(dateVal.substr(0, 3) + "/" + dateVal.substr(3, 2) + "/" + dateVal.substr(5, 2));
    } else if (dateVal.length == 6) //判斷為沒有分隔符號('/')的正確日期，如970911，則自動幫他補('/')+補0
    {
        aObj.val(addZero(dateVal.substr(0, 2), 3) + "/" + addZero(dateVal.substr(2, 2), 2) + "/" + addZero(dateVal.substr(4, 2), 2));
    }
    var reg = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    var wDate = westDate(aObj.val());
    if (reg.test(wDate)) {
        var newDate = new Date(wDate);
        if (newDate == "NaN") {
            bDateCheck = false;
            aObj.val('');
            window.setTimeout(function() { aObj.focus(); }, 0);
            return false;
        } else {
            var aiYear = newDate.getFullYear() - 1911;
            var date1 = addZero(aiYear.toString(), 3) + "/" + addZero((newDate.getMonth() + 1).toString(), 2) + "/" + addZero(newDate.getDate().toString(), 2);
            var dateTemp = aObj.val().split("/");
            var date2 = addZero(parseInt(dateTemp[0], 10).toString(), 3) + "/" +
                addZero(parseInt(dateTemp[1], 10).toString(), 2) + "/" +
                addZero(parseInt(dateTemp[2], 10).toString(), 2);
            if (date1 != date2) {
                bDateCheck = false;
                aObj.val('');
                window.setTimeout(function() { aObj.focus(); }, 0);
                return false;
            } else {
                aObj.val(date1);
            }
        }
    } else {
        bDateCheck = false;
        aObj.val('');
        window.setTimeout(function() { aObj.focus(); }, 0);
        return false;
    }
    return true;
}


// 檢查日期格式
function checkDateStr(dateVal) {
    var dateVal = dateVal.trim();
    var reg = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    var wDate = westDate(dateVal);
    if (reg.test(wDate)) {
        var newDate = new Date(wDate);
        if (newDate == "NaN") {
            return false;
        } else {
            var aiYear = newDate.getFullYear() - 1911;
            var date1 = addZero(aiYear.toString(), 3) + "/" + addZero((newDate.getMonth() + 1).toString(), 2) + "/" + addZero(newDate.getDate().toString(), 2);
            var dateTemp = dateVal.split("/");
            var date2 = addZero(parseInt(dateTemp[0], 10).toString(), 3) + "/" +
                addZero(parseInt(dateTemp[1], 10).toString(), 2) + "/" +
                addZero(parseInt(dateTemp[2], 10).toString(), 2);
            if (date1 != date2) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        return false;
    }

    return true;
}


function westDate(asDate) {
    if (asDate == "") return "";
    // var dateTemp = asDate.split("/");
    var dateTemp = asDate.split("-");
    var sDate = "";
    var tmpYear = parseInt(dateTemp[0], 10); //+ 1911;
    sDate = tmpYear;

    var parseDate = parseInt(dateTemp[1], 10);
    if (parseDate < 10)
        sDate += "/0" + parseDate;
    else
        sDate += "/" + parseDate;
    parseDate = parseInt(dateTemp[2], 10);
    if (parseDate < 10)
        sDate += "/0" + parseDate;
    else
        sDate += "/" + parseDate;
    return sDate;
}

//--計算年齡(yyy/MM/dd)
function GetAge(Birthdate, EndDate) {
    var age = 0;
    if (Birthdate == '' || Birthdate == '/  /') {
        return 0;
    }

    ss = Birthdate.split('/');
    b_y = parseInt(ss[0], 10);
    b_m = parseInt(ss[1], 10);
    b_d = parseInt(ss[2], 10);

    if (EndDate == '') {
        ss = new Date().format_Date('/').split('/');
    } else {
        ss = EndDate.split('/');
    }
    a_y = parseInt(ss[0], 10);
    a_m = parseInt(ss[1], 10);
    a_d = parseInt(ss[2], 10);

    if (b_y == 0 || b_m == 0 || b_d == 0 || a_y == 0 || a_m == 0 || a_d == 0) {
        return 0;
    }

    month_start = (b_m + 6).toString();
    month_end = (b_m - 6).toString();
    year_start = a_y.toString();
    year_end = a_y.toString();

    if (parseInt(month_start, 10) > 12) {
        month_start = (parseInt(month_start, 10) - 12).toString();
        year_start = (parseInt(year_start, 10) + 1).toString();;
    }

    if (parseInt(month_end, 10) < 1) {
        month_end = (parseInt(month_end, 10) + 12).toString();
        year_end = (parseInt(year_end, 10) - 1).toString();
    }

    month_start = addZero(parseInt(month_start, 10).toString(), 2);
    month_end = addZero(parseInt(month_end, 10).toString(), 2);
    year_start = addZero(parseInt(year_start, 10).toString(), 3);
    year_end = addZero(parseInt(year_end, 10).toString(), 3);

    date_start = year_start + "/" + month_start + "/" + addZero(parseInt(b_d, 10).toString(), 2);
    date_end = year_end + "/" + month_end + "/" + addZero(parseInt(b_d, 10).toString(), 2);
    acc_date = addZero(a_y.toString(), 3) + "/" + addZero(a_m.toString(), 2) + "/" + addZero(a_d.toString(), 2);

    age = a_y - b_y;

    if (acc_date.Todate() >= date_start.Todate()) {
        age += 1;
    } else if (acc_date.Todate() <= date_end.Todate()) {
        age -= 1;
    }

    if (age < 0) {
        age = 0;
    }
    return age;
}

//--複製物件    
function clone(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        } else {
            this[i] = source[i];
        }
    }
}

//--日期轉換成日期字串(yyy/MM/dd)
Date.prototype.format_Date = function() {
    try {
        var m = this.getMonth();
        m++;
        var d = this.getDate();
        var mm = (m > 9 ? m : "0" + (m));
        var dd = (d > 9 ? d : "0" + (d));
        //  var aiYear = this.getFullYear() - 1911;
        var aiYear = this.getFullYear();
        if (aiYear < 100) {
            aiYear = "0" + aiYear;
        }
        var formatDate = aiYear + '-' + mm + '-' + dd;
        return formatDate;
    } catch (ex) {
        return '';
    }
}

//--日期轉換成日期時間字串(yyy/MM/dd hh:mm)
Date.prototype.format_DateTime = function() {
    try {
        var m = this.getMonth() + 1;
        var d = this.getDate();
        var h = this.getHours();
        var M = this.getMinutes();

        var mm = (m > 9 ? m : "0" + (m));
        var dd = (d > 9 ? d : "0" + (d));
        var hh = (h > 9 ? h : "0" + (h));
        var MM = (M > 9 ? M : "0" + (M));

        var aiYear = this.getFullYear() - 1911;
        if (aiYear < 100) {
            aiYear = "0" + aiYear;
        }
        var formatDateTime = aiYear + '-' + mm + '-' + dd + ' ' + hh + ':' + MM;
        return formatDateTime;
    } catch (ex) {
        return '';
    }
}

//--日期往前(n...日)
Date.prototype.adddays = function(addday) {
    return new Date(this.getTime() + addday * 24 * 60 * 60 * 1000);
}

Date.prototype.addtimes = function(addhour, fmt) { // 加 n 小時
    var tdate = new Date(this.getTime() + addhour * 60 * 60 * 1000);
    return tdate.Format(fmt);
}
Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
        //call: var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss"); 
    }
    //   
function getToday() {
    date = new Date();
    return date.format_Date();
}


function format_date(date) {
    if (date != null) {
        date = new Date(date);
        //  return date.format_Date();
        return date.Format("yyyy-MM-dd");
    } else {
        return '';
    }
}


function getTime(NowDate = "", type = 1) {　
    if (NowDate == "") {
        NowDate = new Date();
    } else {
        NowDate.replace(" ", "T") + "Z"; // 2018.02.07 for safari 時間
        //  NowDate.replace(/-/g, '/'); // 2018.02.07 for safari 時間
        NowDate = new Date(NowDate);
    }

    var h = ('0' + NowDate.getHours()).substr(-2);　
    var m = ('0' + NowDate.getMinutes()).substr(-2);　
    var s = ('0' + NowDate.getSeconds()).substr(-2);　
    if (type == 2) {
        return h + ":" + m;
    } else {
        return h + ":" + m + ":" + s;
    }
}

function chkNull(mvar) {
    if (mvar == null || typeof mvar == 'undefined') {
        //  mvar = '&nbsp;'
        mvar = '';
    }
    return mvar
}


//--四捨五入
function roundNum(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

function formatnum(num) {
    n = num.toString();
    var re = /(-?\d+)(\d{3})/;
    while (re.test(n)) {
        n = n.replace(re, "$1,$2");
    }
    return n;
}

//--字串轉換整數
function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str != null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}

///千分位
function formatNumber(n) {
    n += "";
    var arr = n.split(".");
    var re = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
}

///解除千分位--
function formatNumber_re(n) {
    return n.replace(/[,]+/g, "");
}

///帶小數的四捨五入
///val:數值, precision:小數點位數
function roundDecimal(val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

/// 檢查os版本
function check_os() {
    windows = (navigator.userAgent.indexOf("Windows", 0) != -1) ? 1 : 0;
    mac = (navigator.userAgent.indexOf("mac", 0) != -1) ? 1 : 0;
    linux = (navigator.userAgent.indexOf("Linux", 0) != -1) ? 1 : 0;
    unix = (navigator.userAgent.indexOf("X11", 0) != -1) ? 1 : 0;

    if (windows) os_type = "MS Windows";
    else if (mac) os_type = "Apple mac";
    else if (linux) os_type = "Lunix";
    else if (unix) os_type = "Unix";

    return os_type;
}

//載入片語檔到下拉選項(select)
//phraseObj : 存放所有片語的JSON物件
//fdObj 參數物件 : {typeInx:片語大類索引, typeInx:片語小類代碼, textInx:片語名稱索引, addEmpty:是否在Select新增第一個空白}
//codetype : 要篩選的片語大類
//selectctrl : Select物件的ID
function loadSelect(phraseObj, fdObj, codetype, selectctrl) {
    var defCongig = { typeInx: -1, valueInx: 1, textInx: 2, defSelInx: -1, addEmpty: false }; //預設參數
    fdObj = $.extend(true, defCongig, fdObj);
    var obj_ = $('#' + selectctrl);
    if (obj_ != null) {
        obj_.children().remove();
        addCount = 0;
        if (fdObj.addEmpty) {
            addCount++;
            obj_.append("<option>全部</option>");
        }

        for (var i = 0; i < phraseObj.length; i++) {
            if (fdObj.typeInx != -1 && phraseObj[i][fdObj.typeInx] != codetype)
                continue;
            if (phraseObj[i][fdObj.textInx] == '') {
                continue;
            }
            addCount++;
            obj_.append("<option value='" + phraseObj[i][fdObj.valueInx] + "'>" + phraseObj[i][fdObj.textInx] + "</option>");
        }
        if (fdObj.defSelInx != -1) {
            //  alert(fdObj.defSelInx)
            obj_.attr('selectedIndex', fdObj.defSelInx);
        }
    }
}

//載入選項到下拉select
function load_select(mdata) {
    $.ajax({
        url: "src/inc/rtui_ajax.php",
        type: "POST",
        dataType: "json",
        data: mdata,
        success: function(res, status) {
            console.log(JSON.stringify(res));
            try {
                if (status == "success" || status == "notmodified") {
                    // data_model = eval(res);
                    return eval(res);
                }
            } catch (e) {
                alert('error:' + e);
            }
        },
        error: function(res, status) {
            showerror2(res);
        },
        timeout: 300000 //--連線逾時定為 五分鐘  
    });
    return {};
}

function post_to_url(path, params, method, target) {
    method = method || "post"; // Set method to post by default, if not specified.
    target = target || "_blank";
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", target);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form); // Not entirely sure if this is necessary
    form.submit();
    //post_to_url('http://example.com/', {'q':'a'});
}

function dialog_alert(msg = '', tit = '請確認') {
    // 建立對話框div
    var markup = [
        '<div id="dialog_alert"  title="' + tit + '">',
        '<p>', msg, '</p>',
        '</div>'
    ].join('');
    $('body').append(markup);
    $('#dialog_alert').dialog();
}