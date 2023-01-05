// 上传后的操作
layui.use(['upload', 'layer', 'element', 'form','croppers'], function() {
    let {upload, layer, form, jquery: $, croppers} = layui;
    // 用户是否上传过图片
    let flag = false;

    // 图片上传操作
    croppers.render({
        elem: '#card_img' //绑定元素
        ,saveW:650     //保存宽度
        ,saveH:650
        ,mark:1/1    //选取比例
        ,area:'700px',  //弹窗宽度
        minCropBoxWidth: 650,
        minCropBoxHeight: 650,

        url: '/upload/', //上传接口
        size: 5120, // 文件最大5MB
        exts: 'jpg|png|jpeg', // 接收图片的后缀限制
        done: function(res) {
            if (res.success === true) {
                flag = true;
                layer.msg('上传成功', {icon: 1, time: 1000});
                layer.closeAll('page');
                // 将uuid赋值给表单
                form.val("form1", {
                    "cardUuid": res.cardUuid
                });
            } else {
                layer.msg(res.message, {icon: 2, time: 1000, anim: 6});
            }
        }
        // before: function() {
        //     layer.load(); //上传loading
        // },
        // done: function(res) {
        //     // 关闭loading标志
        //     layer.closeAll('loading');
        //     if (res.success === true) {
        //         // 将flag变为true
        //         flag = true;
        //         layer.msg('上传成功', {icon: 1, time: 1000});
        //         // 将uuid赋值给表单
        //         form.val("form1", {
        //             "cardUuid": res.cardUuid
        //         });
        //
        //     } else {
        //         // 上传失败
        //         layer.msg(res.message, {icon: 2, time: 1000, anim: 6});
        //     }
        // },
        // error: function() {
        //     // 关闭loading标志
        //     layer.closeAll('loading');
        //     layer.msg('上传图片请求失败', {icon: 2, time: 1000, anim: 6});
        // }
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

        let cardSaleWidth = 20, cardSaleHeight = 14,
            cardColor2Width = 299, cardColor2Height = 66,
            cardQualityWidth = 276, cardQualityHeight = 2,
            cardLifeWidth = 283, cardLifeHeight = 516,
            cardStrengthWidth = 21, cardStrengthHeight = 516,
            artWidth = 283, artHeight = 517;

        // 微调参数
        let color1 = $('#card_color1').val(),
            color2 = $('#card_color2').val(),
            type = $("input[name='cardType']:checked").val();
        if (color1 === 'white' && color2 === 'red' && type === 'biology') {
            cardSaleWidth -= 3;
            cardSaleHeight -= 3;
            cardColor2Width += 1;
            cardColor2Height -= 2;
            cardQualityWidth += 2;
            cardQualityHeight -= 2;
        } else if (color1 === 'white' && color2 === 'black' && type === 'biology') {
            cardSaleWidth -= 3;
            cardSaleHeight -= 3;
            cardColor2Width += 2;
            cardColor2Height -= 2;
            cardQualityWidth += 2;
            cardQualityHeight -= 2;
            cardLifeWidth += 1;
            cardLifeHeight += 2;
            cardStrengthWidth -= 2;
            cardStrengthHeight += 2;
        } else if (color1 === 'blue' && color2 === 'green' && type === 'biology') {
            cardSaleWidth -= 3;
            cardSaleHeight -= 3;
            cardColor2Width += 3;
            cardColor2Height -= 2;
            cardQualityWidth += 2;
            cardQualityHeight -= 3;
            cardLifeWidth += 3;
            cardLifeHeight += 2;
            cardStrengthWidth -= 1;
            cardStrengthHeight += 2;
        } else if (color1 === 'white' && color2 === 'black' && type === 'magic') {
            cardColor2Width += 2;
            cardColor2Height -= 2;
            cardQualityWidth += 2;
            cardQualityHeight -= 2;
        } else if (color1 === 'blue' && color2 === 'red' && type === 'artifact') {
            cardSaleWidth -= 1;
            cardSaleHeight -= 1;
            cardColor2Width += 1;
            cardColor2Height -= 2;
            cardQualityWidth += 1;
            cardQualityHeight -= 2;
        }

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
                cardPaint.drawImage(cardImg, 9, 9, cardImg.width * 0.5, cardImg.height * 0.5);
            };
        }).then(function() {
            // 绘制费用
            let cardSale = new Image();
            cardSale.src = data.cardSale;
            cardSale.onload = function() {
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardSale, cardSaleWidth, cardSaleHeight, cardSale.width, cardSale.height);
                if ($('#cardSale').val() >= 10) {
                    cardPaint.drawImage(cardSale, cardSaleWidth - 4, cardSaleHeight - 4, cardSale.width * 1.15, cardSale.height * 1.15);
                }
            };
            // 绘制色块
            let cardColor2 = new Image();
            cardColor2.src = data.cardColor2;
            cardColor2.onload = function() {
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardColor2, cardColor2Width, cardColor2Height, cardColor2.width, cardColor2.height);
            };
            // 绘制稀有度
            let cardQuality = new Image();
            cardQuality.src = data.cardQuality;
            cardQuality.onload = function() {
                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.drawImage(cardQuality, cardQualityWidth, cardQualityHeight, cardQuality.width, cardQuality.height);

                cardPaint.globalCompositeOperation = 'source-over';
                cardPaint.globalAlpha = 1;
                cardPaint.font = "normal 26px 'xiaolishu'";
                cardPaint.textAlign = 'center';
                cardPaint.fillStyle = "#000000";
                if ($('#card_quility').val() == 4) {
                    // cardPaint.fillStyle = "#EAC100";
                } else {

                }

                cardPaint.fillText(data.cardName, 165, 336, 200);

                // 绘制卡牌描述
                let maxSize = 0, fontsize = '', all = data.cardDesc.replaceAll("b", "").length
                    , startHeight = 0, inteval = 0;
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
                let bNumberTemp = 0;
                for (let item of temp) {
                    let tempStr = '', count = 0, bcount = 0;
                    for (let i = 0; i < item.length; i++) {
                        // 若是中文，count + 1，否则count + 0.75(中文更宽)
                        if (item.charCodeAt(i) > 127 || item.charCodeAt(i) === 94)
                            count += 1;
                        else if (item.charCodeAt(i) == 98)
                            bcount++;
                        else
                            count += 0.5;

                        // 临时字符串，用于拼接
                        tempStr += item[i];
                        // 每隔一个maxSize切分一次，并将拼接字符串清空
                        if (count >= maxSize) {
                            if (bcount % 2 == 1) {
                                if (bNumberTemp % 2 == 0) {
                                    tempStr += 'b';
                                } else {
                                    tempStr = 'b' + tempStr;
                                }
                                bcount++;
                                bNumberTemp++;
                            }
                            describe.push(tempStr);
                            tempStr = '';
                            count = 0;
                        }
                    }
                    if (tempStr.length > 0) {
                        if (bcount % 2 == 1) {
                            if (bNumberTemp % 2 == 0) {
                                tempStr += 'b';
                            } else {
                                tempStr = 'b' + tempStr;
                            }
                            bNumberTemp++;
                        }
                        describe.push(tempStr);
                    }
                }

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
                cardPaint.textAlign = 'left';
                cardPaint.fillStyle = "#363636";
                // 绘制图像
                for (let i = 0; i < describe.length; i++) {
                    // let match = describe[i].match(/b(.*)b(.*)/);
                    let lineWidth = cardPaint.measureText(describe[i].replaceAll("b", "")).width;
                    let widthStart = (328 - lineWidth) / 2;

                    paintLine(widthStart, startHeight + i * inteval, describe[i], cardPaint, fontsize);
                }
            };


            // 三者共性图已经处理完
            // 判断是生物还是神器
            let imageChange = 0.85;
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
                    let imageFix = 0.65;
                    if ($('#cardStrength').val() >= 10) {
                        imageFix = imageChange;
                        cardStrengthWidth -= 4;
                        cardStrengthHeight -= 4;
                    }

                    cardPaint.globalCompositeOperation = 'source-over';
                    cardPaint.globalAlpha = 1;
                    cardPaint.drawImage(cardStrength, cardStrengthWidth, cardStrengthHeight, cardStrength.width * imageFix, cardStrength.height * imageFix);
                };
                // 生命
                let cardLife = new Image();
                cardLife.src = data.cardLife;
                cardLife.onload = function() {
                    let imageFix = 0.65;
                    if ($('#cardLife').val() >= 10) {
                        imageFix = imageChange;
                        cardLifeWidth -= 4;
                        cardLifeHeight -= 4;
                    }

                    cardPaint.globalCompositeOperation = 'source-over';
                    cardPaint.globalAlpha = 1;
                    cardPaint.drawImage(cardLife, cardLifeWidth, cardLifeHeight, cardLife.width * imageFix, cardLife.height * imageFix);
                }
            } else if (data.flag === 'artifact') {
                if (data.artifactLife === true) {
                    let artifactLife = new Image();
                    // 添加神器耐久框
                    artifactLife.src = "/images/artifact/life.png";
                    artifactLife.onload = function() {
                        let imageFix = 0.65;
                        if ($('#cardLife').val() >= 10) {
                            imageFix = imageChange;
                            artWidth -= 4;
                            artHeight -= 4;
                        }

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
                            cardPaint.drawImage(cardLife, artWidth, artHeight, cardLife.width * imageFix, cardLife.height * imageFix);
                        };
                    };
                }
            }
        });
    }

    function paintLine(width, height, str, cardPaint, fontsize) {
        let match = str.match(/([^b]*)b([^b]*)b(.*)/);
        console.log(match);
        if (match != null) {
            let preWidth = 0;
            if (match[1].length > 0) {
                preWidth = cardPaint.measureText(match[1]).width;
                cardPaint.font = 'normal' + fontsize + 'Microsoft YaHei';
                cardPaint.fillText(match[1], width, height, preWidth);
            }

            let boldWidth = cardPaint.measureText(match[2]).width;
            cardPaint.font = 'normal bold' + fontsize + 'Microsoft YaHei';
            cardPaint.fillText(match[2], width + preWidth, height, boldWidth);

            if (match[3].length > 0) {
                paintLine(width + preWidth + boldWidth, height, match[3], cardPaint, fontsize);
            }
        } else {
            cardPaint.font = 'normal' + fontsize + 'Microsoft YaHei';
            cardPaint.fillText(str, width, height, 380);
        }
    }

    // 绑定特殊字符提示框
    $('#more_describe').click(function() {
        layer.alert("生物主动技能，神器耐久消耗的标识：<br/>⓿ ❶ ❷ ❸ ❹ ❺ ⓪ ① ② ③ ④ ⑤ zZ ➨ ➤ ➛ ➪<br/>粘贴到卡牌描述框即可使用。" +
            "</br>使用字母b包裹关键字可以实现加粗，例如：</br>\"b登场：b造成1点伤害。\"",
            {title: "特殊符号", btnAlign: 'c', shadeClose: true});
    });

    // 页面初始化方法
    $(function() {
        // $('#reset').click();
        let name = $("input[name='cardType']:checked").val();
        if (name === 'biology') {
            // 生物=>生命、力量、费用
            // 将生命、力量解锁，并设置为必须填
            $('#cardLife').attr('disabled', false).attr('lay-verify', 'required');
            $('#cardStrength').attr('disabled', false).attr('lay-verify', 'required');
        } else if (name === 'magic') {
            // 法术=>费用
            // 将生命、力量锁定并清零，并设置为非必须
            $('#cardLife').val('').attr('disabled', true).attr('lay-verify', '');
            $('#cardStrength').val('').attr('disabled', true).attr('lay-verify', '');
        } else if (name === 'artifact') {
            // 神器=>耐久、费用
            // 将力量锁定并清零，设置为非必须。将耐久解锁，并设置为必须填
            $('#cardLife').attr('disabled', false).attr('lay-verify', 'required');
            $('#cardStrength').val('').attr('disabled', true).attr('lay-verify', '');
        }
        // 刷新所有的select选项
        form.render('select');
    });
});