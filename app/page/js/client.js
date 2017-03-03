/**
 * Created by devin on 2017/2/21.
 * server.js
 * 用于初始化页面
 */
"use strict";
let editor={};
let socket;
const ipc = require('electron').ipcRenderer;
$(function () {
    let loadXml = (data) => {
        $('#code').val(data);
        setEditorValue('code',data);
    };
    $('._loadXml').on('click', function () {
        //disabled(true);
        if($(this).data('isLoaded')&&!confirm('注意：这将重新从服务器读取数据，将覆盖上次内容，确定？','提示')){
            return false;
        }
        let _this = this;
        let xml = $(this).attr('xml');
        if (!xml) {
            let msg = '参数错误，xml路径为空！';
            disabled(false,msg);
            return !!alert(msg);
        }
        socket.emit('xml',{act:'load',fileName:xml},o=>{
            if(o.code!==1){
                return !!alert('错误：'+o.msg);
            }
            loadXml(o.xml);
            $(_this).data('isLoaded',true);
            disabled(false);
            showXmlPath(o.fileName);
            $('#btnSave').data('fileName',o.fileName);
            addLog('读取服务端XML数据成功');
            addLog(o);
        });
    });
    $('#btnSave').on('click',()=>{
        if(!confirm('确定要保存吗？','提示')){
            return false;
        }
        let fileName = $('#btnSave').data('fileName');
        if(''==fileName){
            return !!alert('系统错误，文件名为空！');
        }
        let xml = editor.doc.getValue();
        if(''==xml){
            return !!alert('不能修改为空！');
        }
        socket.emit('xml',{
            act:'save',
            fileName:fileName,
            xml:xml
        },o=>{
            if(o.code!==1){
                return !!alert('错误：'+o.msg);
            }
            alert('修改成功！');
        });
    });
    let disabled = (b,msg=null)=>{
        $('#btnSave').attr('disabled',b);
        $('#btnReload').attr('disabled',b);
        $('#btnLoadXml-list').attr('disabled',b);
        $('#xmlMsg').text(msg);
    };
    let showXmlPath = (xml)=>{
        $('#xmlPath').text(xml);
    };
    //读取文件内容
    $('#btnReadFile').on('change',()=>{
        readSqlFile('sqlCode',document.getElementById('btnReadFile').files);
    });

    //socket
    let CON_SERVER_HOST = 'http://localhost:3002';
    socket = io(CON_SERVER_HOST);
    socket.on('connect',()=>{
        addLog('Server连接成功');
    }).on('connect_error',()=>{
        addLog('连接错误');
    }).on('msg',  (data,cb) =>{
        //console.info(data);
        addLog(data);
        cb && cb(1);
    }).on('xml',(data,cb)=>{
        cb && cb(1);
        //loadXml(data.xml);
        //addLog(data);
        //addLog(data);
    }).on('disconnect',()=>{
        addLog('已断开与Server的连接');
    });

    //以下为Mysql相关
    $('#btnLoadTable').on('click',()=>{
        socket.emit('mysql',{act:'loadTable',table:['t_admin','t_user']},o=>{
            buildTableList(o);
            log('服务器返回：',o);
        });
    });
    //系统版本信息
    $('#version').text(require('electron').remote.app.getVersion());
    //打开新窗口
    $('#btnOpenWin').on('click',()=>{
        ipc.send('openWin',{
            width: 500,
            height: 300,
            //darkThem:true,
            frame: true,
            titleBarStyle:'hidden-inse',
            backgroundColor: '#eee',
            show:true,
            skipTaskbar:true,
            title:'服务器IP配置',
            resizable:false,
            //movable:false
        },true,true);
    });
});

let buildTableList = (o)=>{
    for (let v of o){
        for(let _v of v){
            log(_v.Field,_v.Comment);
        }
    }
};

/**
 * 读取文件内容
 * @param files
 */
let readSqlFile = (codeDomId,files) => {
    if(files.length) {
        let file = files[0];
        let reader = new FileReader();
        reader.onload = function() {
            setEditorValue(codeDomId,this.result,'text/x-mysql');
        };
        reader.readAsText(file);
        /*reader.onerror((err)=>{
            alert('读取文件失败：'+err);
        });*/
    }
};

let setEditorValue = (codeDomId,data,mode='text/html')=>{
    if(!editor[codeDomId]){
        editor[codeDomId] = CodeMirror.fromTextArea(document.getElementById(codeDomId), {
            mode: mode,//"text/html",
            lineNumbers: true,
            theme: 'xq-light'
        });
    }
    editor[codeDomId].doc.setValue(data);
};
/**
 * 日志文件
 * @param msg
 */
let log  = (...msg)=>{
    console.log(...msg);
};
let  addLog = log;