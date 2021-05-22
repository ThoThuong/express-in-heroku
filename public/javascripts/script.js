// const { Promise } = require("mongoose");


$(function () {


    const corePath = window.navigator.userAgent.indexOf("Edge") > -1
        ? '/javascripts/provider/tesseract-core.asm.js'
        : '/javascripts/provider/tesseract-core.wasm.js';
    const worker = new Tesseract.TesseractWorker({
        corePath,
    });
    alertify.set('notifier', 'position', 'top-right');

    let recognizeFileTest = async (file) => {
        const corePath = window.navigator.userAgent.indexOf("Edge") > -1
            ? '/javascripts/provider/tesseract-core.asm.js'
            : '/javascripts/provider/tesseract-core.wasm.js';
        const worker = new Tesseract.TesseractWorker({
            corePath,
        });
        labelLanguage = $("#langsel").val();
        let test = await worker.recognize(file, labelLanguage)
            .then((data) => {
                console.log(data);
                let test = data.text.split(`\n`);
                test = test.map(ele => {
                    if (ele) {
                        if (ele.trim().length > 0) {
                            return ele;
                        }
                    }
                })
                console.log(test);
                $('#test').html(data.text)
            });

    };

    $(document).on('change', '#file-1', (e) => {
        /*
        // let filename1 = $('input[type=file]').val().split('\\').pop();
        // let filename2 = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')
        */
        let file = e.target.files[0];
        let dataFiles = new FormData();
        dataFiles.append('image', file);
        $("#arrow-right").removeClass("fa-arrow-right");
        $("#arrow-right").addClass("fa-spinner fa-spin");
        $("#arrow-down").removeClass("fa-arrow-down");
        $("#arrow-down").addClass("fa-spinner fa-spin");

        $('#date-time-show').html('');
        $('#detail-show').html('');
        $('#total-show').html('');
        $('#address-show').html('')

        $.ajax({
            type: "POST",
            url: 'http://127.0.0.1:5000/api/test',
            data: dataFiles,
            contentType: false,
            processData: false,
            dataType: 'json',
        }).then((data) => {
            if (data.error) {
                alertify.notify(`do not extract. Reload page to solve`, 'error', 15);
                return;
            }

            if (data.files) {
                let result = data.files
                result =
                    result.reduce((previous, current) => {
                        let key = Object.keys(current)[0];
                        if (previous[key]) {
                            previous[key].push(current[key]);
                        } else {
                            previous[key] = [current[key]];
                        }
                        return previous;
                    }, {});
                const { address, datetime, total, item, imgWithBox } = result;
                $("#selected-image").attr('src', 'data:image/jpeg;base64,' + imgWithBox);
                let htmlSubImage = '<div class="owl-carousel d-flex owl-theme">';

                if (address) {
                    for (const img of address) {
                        htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                    }
                    startExtractInfo(address, '#address-show', 'Address', '#log-address');
                }
                if (datetime) {
                    for (const img of datetime) {
                        htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                    }
                    startExtractInfo(datetime, '#date-time-show', 'DateTime', '#log-date-time');
                }
                if (item) {
                    for (const img of item) {
                        htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                    }
                    startExtractInfo(item, '#detail-show', 'item', '#log-detail');
                }
                if (total) {
                    for (const img of total) {
                        htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                    }
                    startExtractInfo(total, '#total-show', 'Total', '#log-total');
                }
                htmlSubImage += '</div>';
                $('#sub-image-extracted').html(htmlSubImage);
                $("#sub-image-extracted>.owl-carousel").owlCarousel({
                    responsive: {
                        nav: true,
                        center: true,
                        loop: false,
                        0: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        1000: {
                            items: 1
                        }
                    }
                });

            }


            $("#sub-image-extracted>.owl-carousel").addClass('flex-column')
            $('.owl-carousel .owl-stage-outer').removeClass('customCARO').addClass('customCARO');
            $(".fas").removeClass('fa-spinner fa-spin');
            $(".fas").addClass('fa-check');
        }).catch(error => {
            console.log('something not correct', error);
        })






        /* startRecognize('data:image/jpeg;base64,' + imgLabel);*/
    });
    let startExtractInfo = (listFile, idShow, label, idShowLog) => {
        labelLanguage = $("#langsel").val();
        listFile.forEach((file) => {
            worker.recognize('data:image/jpeg;base64,' + file, labelLanguage)
                .progress((packet) => {
                    processStatus(packet, label, idShowLog, idShow);
                }).then((data) => {
                    const dataProcess = data.lines.map(line => line.text);
                    let textStandard = data.text;
                    if (label === 'item') {
                        textStandard = data.lines
                        linePrice = textStandard.splice(textStandard.length - 1, 1)
                        console.log(linePrice);
                        nameItem = ''
                        console.log('sau khi catws ', textStandard);
                        textStandard = textStandard.map(ele => ele.text)
                        nameItem = textStandard.join(' ')
                        console.log('sau khi chu', nameItem);

                        linePrice = linePrice[0].text.split(' ')
                        price = linePrice[linePrice.length - 1]

                        // textStandard = {
                        //     'item name': nameItem,
                        //     'price': price,
                        //     'line price': linePrice
                        // }
                        textStandard = nameItem + 'Price is: ' + price;

                    }

                    const packet = { status: 'done', result: dataProcess, rs2: textStandard };
                    return processStatus(packet, label, idShowLog, idShow);
                }).catch(err => {
                    alertify.notify(`There are some minor bugs happening, please reload the page to resolve this issue. Reason => ${err}`, 'warning', 15);
                });
        });
    }


    let processStatus = (packet, label, idShowLog, idShow) => {
        // console.log(packet, label, idShowLog, idShow);
        let logCurrent = $(idShowLog);
        // console.log(logCurrent, $(`${idShowLog} #loading-tesseract-core`).length, $(`${idShowLog} #loading-tesseract-core`));
        switch (packet.status) {
            case 'loading tesseract core':
                console.log('loading tesseract core', packet);
                if (packet.progress === 0) {
                    let line = `Start extract info on <span id="label-on-process">${label} image</span>
                                <div id="loading-tesseract-core">
                                    ${packet.status}
                                    <progress value="${packet.progress}" max="1"></progress>
                                </div>`;
                    // log.html(line);
                    logCurrent.html(line);
                    console.log(logCurrent, 'khi thấy không có gì thì nó appen vào');
                } else {
                    $(`${idShowLog} #loading-tesseract-core>progress`).val(packet.progress);
                }
                break;
            case 'initializing tesseract':
                // console.log('initializing tesseract', packet);
                let lineInitTes = `<div id="initializing-tesseract">
                                    ${packet.status}
                                    <progress value="${packet.progress}" max="1"></progress>
                                </div>`;
                $(`${idShowLog} #loading-tesseract-core`).after(lineInitTes);
                break;
            case 'initialized tesseract':
                // console.log('initialized tesseract', packet);
                $(`${idShowLog} #initializing-tesseract>progress`).val(packet.progress);
                break;
            case 'loading language traineddata':
                // console.log('loading language traineddata', packet);
                // let isProcessAfter = $(`${idShowLog}>div>progress`);
                let lineForLoadingTes = `Start extract info on <span id="label-on-process">${label} image</span>
                                <div id="loading-tesseract-core">
                                    ${'loading tesseract core'}
                                    <progress value="${1}" max="1"></progress>
                                </div>`;
                let lineInitTesseract = `<div id="initializing-tesseract">
                                    ${'initialized tesseract'}
                                    <progress value="${1}" max="1"></progress>
                                </div>`;
                let lineLoadingLg = `<div id="loading-language-traineddata">
                                    ${packet.status}
                                    <progress value = "${packet.progress}" max="1"></progress>
                                </div>`;
                logCurrent.html(lineForLoadingTes + lineInitTesseract + lineLoadingLg);

                break;
            case 'loaded language traineddata':
                // console.log('loaded language traineddata', packet);
                $(`${idShowLog} #loading-language-traineddata>progress`).val(packet.progress);
                break;
            case 'initializing api':
                // console.log('initializing api', packet);
                if ($(`${idShowLog} #initializing-api`).length != 1) {
                    let lineInitApi = `<div id = "initializing-api">
                                        ${packet.status}
                                        <progress value="${packet.progress}" max="1"></progress>
                                        </div > `;
                    $(`${idShowLog} #loading-language-traineddata`).after(lineInitApi);
                } else {
                    $(`${idShowLog} #initializing-api>progress`).val(packet.progress);
                }
                break;
            case 'recognizing text':
                // console.log('recognizing text', packet);
                if ($(`${idShowLog} #recognizing-text`).length != 1) {
                    let lineRegText = `<div id="recognizing-text">
                                            ${packet.status}
                                            <progress value="${packet.progress}" max="1"></progress>
                                        </div>`;
                    $(`${idShowLog} #initializing-api`).after(lineRegText);
                } else {
                    $(`${idShowLog} #recognizing-text>progress`).val(packet.progress);
                }
                break;
            case 'done':
                // console.log('done', packet);
                return showResultExtract(packet.result, idShow, label, packet.rs2);
            // break;
        }
    };

    let showResultExtract = (line, idShow, label, texts) => {
        console.log(label);
        console.log(texts);
        console.log(line);
        /*
        result = ``;
        line.forEach(element => {
            result += `<p> ${element}</p>`;
        });
        */
        result = `<p>${texts}<p>`
        $(idShow).append(result);

        return {
            label: result
        };

    };








    $(document).on('click', '#startLink', (e) => {
        e.preventDefault();
    });

    $(document).on('click', '.logout', (e) => {
        e.preventDefault();
        window.location = 'http://localhost:3000/authen/logout'
    });

    $('#user').click((e) => {
        e.preventDefault();
        window.location = 'http://localhost:3000/api/info-user';
    });

    $('#homePage').click((e) => {
        e.preventDefault();
        window.location = 'http://localhost:3000/';
    });

    $('#list-invoice').click((e) => {
        e.preventDefault();
        window.location = 'http://localhost:3000/api/list-invoice';
    });

    $('button[edit]').click(function () {

        $('#if :input').prop('disabled', false);
        $('#if :input').prop('readonly', false);
        $(this).attr('disabled', true)
    })
    $('button[save]').click(async (e) => {
        const dt = $('#if :input').map(function () {
            keya = $(this).attr('id');
            value = $(this).val();
            if (keya === 'male' || keya === 'female') {
                value = $(`input[id = '${keya}']: checked`).val();
                keya = 'gender';
            }
            if (value !== undefined) {
                objCurrent = new Object();
                objCurrent[keya] = value;
                console.log(objCurrent);
            }
            return objCurrent
        }).get();
        dt.splice(7, 3);
        const data = dt.reduce((previous, current) => {
            key = Object.keys(current)[0];
            previous[key] = current[key];
            return previous;
        }, {});

        if ((data.email.trim()).length > 0) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/api/update-info-user",
                data: {
                    '_id': $('#idUserCurrent').val(),
                    'data': data
                },
                success: (res) => {
                    $('#if :input').prop('disabled', true);
                    $('#if :input').prop('readonly', true);
                    $(this).attr('disabled', false);
                    alertify.notify('success', 'success', 5);
                },
                error: (err) => {
                    alertify.notify('error', 'success', 5);
                }
            });
        } else {
            alertify.notify('do not empty email', 'success', 5);
        }
    })
    $('button[cancel]').click((e) => {
        window.location = 'http://localhost:3000/api/info-user';
    })




});