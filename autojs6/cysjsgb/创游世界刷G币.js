//此脚本为AutoJs6脚本 https://github.com/SuperMonster003/AutoJs6

auto.waitFor() //等待无障碍
//setScreenMetrics(1080, 2340) //适配不同分辨率
console.clear() //清空控制台
console.show() //显示控制台
log("使用时建议最小化控制台，以免误判")

//初始化OCR
const Predictor = com.baidu.paddle.lite.ocr.Predictor;

let currentEngine = engines.myEngine();
let runningEngines = engines.all();
let currentSource = `${currentEngine.getSource()}`;
if (runningEngines.length > 1) {
    runningEngines.forEach(compareEngine => {
        let compareSource = `${compareEngine.getSource()}`;
        if (currentEngine.getId() !== compareEngine.getId() && compareSource === currentSource) {
            // 强制关闭同名的脚本
            compareEngine.forceStop();
        }
    });
}

// 指定是否用精简版模型 速度较快
let useSlim = true;
// 创建检测器
let predictor = new Predictor();

// predictor.cpuThreadNum = 4 // 可以自定义使用CPU的线程数
// predictor.checkModelLoaded = false // 可以自定义是否需要校验模型是否成功加载 默认开启 使用内置Base64图片进行校验 识别测试文本来校验模型是否加载成功

// 初始化模型 首次运行时会比较耗时
let loading = threads.disposable();

// 建议在新线程中初始化模型
threads.start(function() {
    loading.setAndNotify(predictor.init(context, useSlim));
    // loading.setAndNotify(predictor.init(context)) 为默认不使用精简版
    // 内置默认 modelPath 为 models/ocr_v3_for_cpu，初始化自定义模型请写绝对路径否则无法获取到
    // 内置默认 labelPath 为 labels/ppocr_keys_v1.txt
    // let modelPath = files.path('./models/customize') // 指定自定义模型路径
    // let labelPath = files.path('./models/customize') // 指定自定义label路径
    // 使用自定义模型时det rec cls三个模型文件名称需要手动指定
    // predictor.detModelFilename = 'det_opt.nb'
    // predictor.recModelFilename = 'rec_opt.nb'
    // predictor.clsModelFilename = 'cls_opt.nb'
    // loading.setAndNotify(predictor.init(context, modelPath, labelPath))
});
let loadSuccess = loading.blockedGet();
if (!loadSuccess) {
    log('初始化ocr失败');
}

var 广告刷G币计次 = 0
var 悬浮窗 = floaty.window(
    <frame gravity="center" bg="#aaff0000">
        <scroll>
            <linear orientation="vertical" w = "*" h = "auto" gravity = "center">
                <text>创游世界刷G币脚本，教程请前往https://csjdyr001.github.io/</text>
                <button id="设置悬浮窗大小">设置悬浮窗大小</button>
                <Switch id="自动看广告刷G币" checked="false" text="自动看广告刷G币"/>
            </linear>
        </scroll>
    </frame>
);
悬浮窗.exitOnClose()
悬浮窗.setSize(600, 400)
悬浮窗.setPosition(500, 100)
悬浮窗.设置悬浮窗大小.click(() => {
    悬浮窗.setAdjustEnabled(!悬浮窗.isAdjustEnabled());
});
悬浮窗.自动看广告刷G币.on("check", (checked) => {
    if (checked) {
        广告刷G币()
    } else {
        log("停止自动广告刷G币")
    }
})

function 广告刷G币() {
    if (悬浮窗.自动看广告刷G币.checked) {
        threads.start(() => {
            if (requestScreenCapture()) {
                log("开始自动广告刷G币")
                //while (悬浮窗.自动看广告刷G币.checked) {
                className("android.widget.ImageView").clickable(true).depth(13).findOne().click() //click(490, 712) //点击"获得G币"按钮
                sleep(200) //等待窗口弹出
                //click(999,610)//关闭窗口
                className("android.widget.ImageView").desc("获得G币").findOne().click() //click(570, 1748) //点击新的"获得G币按钮"
                检查广告是否播放完毕(() => {
                    //等待数据刷新
                    sleep(5000)
                    广告刷G币计次++
                    log("第" + 广告刷G币计次 + "广告刷G币")
                    广告刷G币()
                })
                //}
            } else {
                log("需要录制屏幕权限")
            }
        });
    }
}

function 检查广告是否播放完毕(callback) {
    sleep(10000) //等待十秒钟检查一次
    //swipe(device.width / 2, device.height - 200, device.width / 2, 200, 500)//向上滑动
    back() //按下返回键测试
    className("android.view.View").text("| 跳过").findOne().click() //点击跳过测试
    className("android.widget.LinearLayout").clickable(true).depth(10).findOne().click() //点击X测试
    id("tt_reward_full_count_down").findOne().click()//点击<测试
    sleep(100) //等待返回
    let 广告播放截图 = captureScreen() //截图
    let OCR结果 = predictor.runOcr(广告播放截图.getBitmap())
    log(`广告播放截图OCR结果:${OCR结果}`)
    let found = false
    for (let i = 0; i < OCR结果.length; i++) {
        if (OCR结果[i].label.includes('退出') || OCR结果[i].label.includes('离开')) {
            let ocrResult = OCR结果[i];
            //ocrResult.label, ocrResult.bounds
            found = true
            break
        } else {
            continue
        }
    }
    if (!found) {
        //没找到包含退出的选项，说明广告播放完成，返回
        log("没找到包含退出的选项")
        callback()
    } else {
        //找到了，说明广告没播放完，继续检测
        log("找到了包含退出的选项")
        //点击继续播放
        for (let j = 0; j < OCR结果.length; j++) {
            if (OCR结果[j].label.includes('继续') || OCR结果[j].label.includes('观看')) {
                let ocrResult = OCR结果[j];
                //ocrResult.label, ocrResult.bounds
                click(ocrResult.bounds.centerX(), ocrResult.bounds.centerY())
                检查广告是否播放完毕(callback)
                break
            } else {
                continue
            }
        }
    }
}
setInterval(() => {}, 1000);