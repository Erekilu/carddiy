// 上传后的操作
layui.use(['upload', 'layer', 'element', 'form'], function() {
    let {upload, layer, form, jquery: $} = layui;
    // 用户是否上传过图片
    let flag = false;

    // 图片上传操作
    upload.render({
        elem: '#card_img', //绑定元素
        url: '/upload/', //上传接口
        method: 'post', // post请求
        size: 5120, // 文件最大5MB
        exts: 'jpg|png|jpeg', // 接收图片的后缀限制
        before: function() {
            layer.load(); //上传loading
        },
        done: function(res) {
            // 关闭loading标志
            layer.closeAll('loading');
            if (res.success === true) {
                // 将flag变为true
                flag = true;
                layer.msg('上传成功', {icon: 1, time: 1000});
                // 将uuid赋值给表单
                form.val("form1", {
                    "cardUuid": res.cardUuid
                });

            } else {
                // 上传失败
                layer.msg(res.message, {icon: 2, time: 1000, anim: 6});
            }
        },
        error: function() {
            // 关闭loading标志
            layer.closeAll('loading');
            layer.msg('上传图片请求失败', {icon: 2, time: 1000, anim: 6});
        }
    });

    // 表单提交操作
    form.on('submit(startupload)', function() {
        // 如果用户没有上传图片，则不能提交表单
        if (flag === false) {
            layer.msg('请先上传图片', {icon: 4, time: 1000, anim: 6});
            return false;
        }

        $.ajax({
            type: "post",
            data: $('#form1').serialize(), // 获取表单数据
            url: "/startmake",
            error: function() {
                layer.msg('提交失败', {icon: 2, time: 1000, anim: 6});
            },
            success: function(data) {
                // 绘制canvas
                draw(data);
                // 给画布添加点击下载事件
                // 只有在PC端才能使用，其他系统经测试无法使用
                if (!(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))) {
                    $('#myCanvas').unbind('click').click(function() {
                        let a = document.createElement("a");
                        a.href = document.getElementById('myCanvas').toDataURL();
                        a.download = new Date().getTime() + '.png';
                        a.click();
                    });
                }


                layer.msg('提交成功', {icon: 1, time: 1000});
            }
        });
        return false;
    });

    // 根据卡的种类设定可设置的三围
    form.on('radio()', function(data) {
        if (data.value === 'biology') {
            // 生物=>生命、力量、费用
            // 将生命、力量解锁，并设置为必须填
            $('#cardLife').attr('disabled', false).attr('lay-verify', 'required');
            $('#cardStrength').attr('disabled', false).attr('lay-verify', 'required');
        } else if (data.value === 'magic') {
            // 法术=>费用
            // 将生命、力量锁定并清零，并设置为非必须
            $('#cardLife').val('').attr('disabled', true).attr('lay-verify', '');
            $('#cardStrength').val('').attr('disabled', true).attr('lay-verify', '');
        } else if (data.value === 'artifact') {
            // 神器=>耐久、费用
            // 将力量锁定并清零，设置为非必须。将耐久解锁，并设置为必须填
            $('#cardLife').attr('disabled', false).attr('lay-verify', 'required');
            $('#cardStrength').val('').attr('disabled', true).attr('lay-verify', '');
        }
        // 刷新所有的select选项
        form.render('select');
    });

    // 绘制图像
    function draw(data)
    {
        // 获取canvas对象
        let paint = document.getElementById('myCanvas');
        // 获取画布
        let cardPaint = paint.getContext("2d");

        new Promise(function(resolve) {
            // 绘制卡底
            let cardType = new Image();
            cardType.src = data.cardType;
            cardType.onload = function() {
                paint.width = cardType.width;
                paint.height = cardType.height;
                cardPaint.drawImage(cardType, 0, 0, paint.width, paint.height);
                resolve();
            };
        }).then(function() {
            // 绘制卡图
            let cardImg = new Image();
            cardImg.src = data.cardImg;
            cardImg.onload = function() {
                // 设置可处理透明
                cardPaint.globalCompositeOperation = 'destination-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardImg, 9, 9, cardImg.width, cardImg.height);
            };
        }).then(function() {
            // 绘制费用
            let cardSale = new Image();
            cardSale.src = data.cardSale;
            cardSale.onload = function() {
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardSale, 20, 14, cardSale.width, cardSale.height);
            };
            // 绘制色块
            let cardColor2 = new Image();
            cardColor2.src = data.cardColor2;
            cardColor2.onload = function() {
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardColor2, 299, 66, cardColor2.width, cardColor2.height);
            };
            // 绘制稀有度
            let cardQuality = new Image();
            cardQuality.src = data.cardQuality;
            cardQuality.onload = function() {
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardQuality, 276, 2, cardQuality.width, cardQuality.height);

                // 绘制卡牌名
                let entity = {
                    AccessKey: '5f2c60307bbe4b06b36d4016e70e5d8a',
                    Content: data.cardName,
                };
                $youzikuClient.getFontFace(entity, function (result) {
                    cardPaint.globalCompositeOperation = 'source-over';
                    cardPaint.globalAlpha = 1;
                    cardPaint.font = 'normal 26px jdlibianjian';
                    cardPaint.textAlign = 'center';
                    cardPaint.fillStyle = "#4f4f4f";
                    cardPaint.fillText(data.cardName, 165, 336, 200);
                });

                // 绘制卡牌描述
                let maxSize = 0, fontsize = '', all = data.cardDesc.length
                    , startHeight = 0, inteval = 0;
                console.log(all);
                // 根据卡牌描述文本长度设置字体大小和每行上限
                if (all <= 24)
                    maxSize = 9, fontsize = ' 28px ';
                else if (all <= 31)
                    maxSize = 10, fontsize = ' 26px ';
                else if (all <= 39)
                    maxSize = 11, fontsize = ' 24px ';
                else // if (all <= 46)
                    maxSize = 12, fontsize = ' 22px ';
                // 将卡牌描述按换行分割，最多分割6个
                let temp = data.cardDesc.split('\r\n', 5);
                let describe = new Array();
                // 将分隔好的字串装入describe数组中，长度动态限制
                for (let item of temp) {
                    let tempStr = '', count = 0;
                    for (let i = 0; i < item.length; i++) {
                        // 若是中文，count + 1，否则count + 0.75(中文更宽)
                        if (item.charCodeAt(i) > 127 || item.charCodeAt(i) === 94)
                            count += 1;
                        else
                            count += 0.75;
                        // 临时字符串，用于拼接
                        tempStr += item[i];
                        // 每隔一个maxSize切分一次，并将拼接字符串清空
                        if (count >= maxSize) {
                            // console.log(count);
                            describe.push(tempStr);
                            tempStr = '';
                            count = 0;
                        }
                    }
                    if (tempStr.length > 0) {
                        describe.push(tempStr);
                        // console.log(count);
                    }
                }
                // console.log(describe);
                // 设置描述框渲染起始高度和行间隔
                if (describe.length == 1)
                    startHeight = 450, inteval = 0;
                else if (describe.length == 2)
                    startHeight = 430, inteval = 40;
                else if (describe.length == 3)
                    startHeight = 410, inteval = 40;
                else if (describe.length == 4)
                    startHeight = 395, inteval = 36;
                else if (describe.length == 5)
                    startHeight = 385, inteval = 34;
                else // if (describe.length == 6)
                    startHeight = 380, inteval = 28;
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.font = 'normal' + fontsize + 'Microsoft YaHei';
                cardPaint.textAlign = 'center';
                cardPaint.fillStyle = "#363636";
                // 绘制图像
                for (let i = 0; i < describe.length; i++) {
                    cardPaint.fillText(describe[i], 165, startHeight + i * inteval, 260);
                }
            };


            // 三者共性图已经处理完
            // 判断是生物还是神器
            if (data.flag === 'biology') {
                // 遮罩
                let shade = new Image();
                shade.src = "/images/biology/shade.png";
                shade.onload = function() {
                    cardPaint.globalCompositeOperation = 'xor';
                    cardPaint.globalAlpha = 1;
                    cardPaint.drawImage(shade, 0, 315, shade.width, shade.height);
                };
                // 力量
                let cardStrength = new Image();
                cardStrength.src = data.cardStrength;
                cardStrength.onload = function() {
                    cardPaint.globalCompositeOperation = 'source-over';
                    cardPaint.globalAlpha = 1;
                    cardPaint.drawImage(cardStrength, 22, 517, cardStrength.width * 0.6, cardStrength.height * 0.6);
                };
                // 生命
                let cardLife = new Image();
                cardLife.src = data.cardLife;
                cardLife.onload = function() {
                    cardPaint.globalCompositeOperation = 'source-over';
                    cardPaint.globalAlpha = 1;
                    cardPaint.drawImage(cardLife, 283, 517, cardLife.width * 0.6, cardLife.height * 0.6);
                }
            } else if (data.flag === 'artifact') {
                if (data.artifactLife === true) {
                    let artifactLife = new Image();
                    // 添加神器耐久框
                    artifactLife.src = "/images/artifact/life.png";
                    artifactLife.onload = function() {
                        cardPaint.globalCompositeOperation = 'source-over';
                        cardPaint.globalAlpha = 1;
                        cardPaint.drawImage(artifactLife, 14, 3, artifactLife.width, artifactLife.height);

                        // 添加神器耐久
                        let cardLife = new Image();
                        // 添加神器耐久
                        cardLife.src = data.cardLife;
                        cardLife.onload = function() {
                            cardPaint.globalCompositeOperation = 'source-over';
                            cardPaint.globalAlpha = 1;
                            cardPaint.drawImage(cardLife, 285, 517, cardLife.width * 0.6, cardLife.height * 0.6);
                        };
                    };
                }
            }
        });
    }

    // 绑定特殊字符提示框
    $('#more_describe').click(function() {
        layer.alert("生物主动技能，神器耐久消耗的标识：<br/>⓿ ❶ ❷ ❸ ❹ ❺ ⓪ ① ② ③ ④ ⑤ zZ ➨ ➤ ➛ ➪<br/>粘贴到卡牌描述框即可使用。",
            {title: "特殊符号", btnAlign: 'c', shadeClose: true});
    });

    // 页面初始化方法
    $(function() {
        // $('#reset').click();
    });
});