/**
 * Created by devin on 2017/2/21.
 * server.js
 * 用于初始化页面
 */
let editor;
let socket;
$(function () {
    let loadXml = (xml) => {
        $.get(xml, function (data) {
            $('#code').val(data);
            if(!editor){
                editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                    mode: "text/html",
                    lineNumbers: true,
                    theme: 'xq-light'
                });
            }else{
                editor.doc.setValue(data);
            }
            socket.emit('xml',{path:'ok'},o=>{
                addLog('callBack'+JSON.stringify(o));
            });
            disabled(false);
            showXmlPath(xml);
        }, 'text').fail(()=>{
            let msg = '加载错误！'+xml;
            disabled(false,msg);
            alert(msg);
        });
    };
    $('._loadXml').on('click', function () {
        disabled(true);
        let xml = $(this).attr('xml');
        if (!xml) {
            let msg = '参数错误，xml路径为空！';
            disabled(false,msg);
            return !!alert(msg);
        }
        loadXml('xml/' + xml);
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
    }).on('disconnect',()=>{
        addLog('已断开与Server的连接');
    });
    let addLog = (msg)=>{
        console.log(msg);
    }
});
/**
 * 回调定义
 * @param o
 */
let baseCb = o =>{
    switch (o.code){
        case 0:
            logger.error(o.msg);
            break;
        case 1:
            logger.info(o.msg);
            break;
        default:
            logger.info(o);
            break;
    }
};
