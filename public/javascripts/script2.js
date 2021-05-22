// const { Promise } = require("mongoose");

$(function () {
    // $("body").css("display", "none");
    // $("body").fadeIn(400);
    // // to fade out before redirect
    // $('a').click(function (e) {
    //     redirect = $(this).attr('href');
    //     e.preventDefault();
    //     $('body').fadeOut(400, function () {
    //         document.location.href = redirect
    //     });
    // });
    const corePath = window.navigator.userAgent.indexOf("Edge") > -1
        ? '/javascripts/provider/tesseract-core.asm.js'
        : '/javascripts/provider/tesseract-core.wasm.js';
    const worker = new Tesseract.TesseractWorker({
        corePath,
    });
    alertify.set('notifier', 'position', 'top-right');

    $(document).on('change', '#file-1', async (e) => {
        /*
        // let filename1 = $('input[type=file]').val().split('\\').pop();
        // let filename2 = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')
        */
        $('#file-1').prop('disabled', true);
        let emitData = new FormData();
        $('#sub-image-extracted').empty();
        if (e.target.files.length > 1) {
            let formImage = new FormData();
            for (let i = 0; i < e.target.files.length; i++) {
                formImage.append(`image${i}`, e.target.files[i]);
            }
            emitData = formImage;
            let htmlSlideBox = '<div class="owl-carousel d-flex owl-theme">'
            for (let i = 0; i < e.target.files.length; i++) {
                htmlSlideBox += `<div>
                                    <img class="col-12 p-0 img-sub" src="${URL.createObjectURL(e.target.files[i])}" alt="target image">
                                </div>`;
            }
            htmlSlideBox += '</div>';
            $('#slide-img-box').html(htmlSlideBox);
            $("#slide-img-box>.owl-carousel").owlCarousel({
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


        } else {

            var htmlOneNew = `<div id='img-box'>
                 <img id="selected-image" class="col-12 p-0" src="---null" alt="target image"/>
            </div>`;
            $('#slide-img-box').html(htmlOneNew);
            let file = e.target.files[0];
            let dataFiles = new FormData();
            dataFiles.append('image', file);
            const selectedImage = document.getElementById('selected-image');
            if (file) {
                selectedImage.src = URL.createObjectURL(file);
            }
            emitData = dataFiles;
        }
        // $("#selected-image").attr('src', 'data:image/jpeg;base64,' + imgWithBox);
        $("#arrow-right").removeClass("fa-arrow-right");
        $("#arrow-right").addClass("fa-spinner fa-spin");
        // $("#arrow-right").text('Recognizing object');
        $("#arrow-down").removeClass("fa-arrow-down");
        $("#arrow-down").addClass("fa-spinner fa-spin");
        // $("#arrow-down").text('Recognizing object');
        $('#content-pro-add').text(`Recognizing Object`);
        $('#date-time-show').html('');
        $('#detail-show').html('');
        $('#total-show').html('');
        $('#address-show').html('')


        // origin url 'http://127.0.0.1:5000/api/test'
        // 192.168.1.5

        let data = await $.ajax({
            type: "POST",
            url: 'http://127.0.0.1:5000/api/test',
            data: emitData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: (data) => {
                getResultToStore(data).then((data) => {
                    const { address, datetime, item, total, imgResult } = data;
                    let addressSave = '';
                    if (address) {
                        addressSave = address.map(ele => {
                            return Object.values(ele)[0];
                        });
                    }

                    let datetimeSave = '';
                    if (datetime) {
                        datetimeSave = datetime.map(ele => {
                            return Object.values(ele)[0];
                        });
                    }

                    let itemSave = ''
                    if (item) {
                        itemSave = item.map(ele => {
                            return Object.values(ele)[0];
                        });
                    }

                    let totalSave = '';
                    if (total) {
                        totalSave = total.map(ele => {
                            return Object.values(ele)[0];
                        });
                    }

                    let imgResultSave = '';
                    if (imgResult) {
                        imgResultSave = imgResult.map(ele => {
                            return `data:image/jpeg;base64, ${ele}`;
                        });
                    }
                    // let dataEmit = {
                    //     'address': addressSave[0] ?? '',
                    //     'datetime': datetimeSave[0] ?? '',
                    //     'items': itemSave ?? [],
                    //     'total': totalSave[0] ?? '',
                    //     'dateTimeExtract': new Date(),
                    //     'dateTimeUpdate': new Date(),
                    //     'imageResult': imgResultSave ?? []
                    // }
                    ;
                    totalUniq = convertMoney(totalSave[0]);
                    dConvert = convertDateTime(datetimeSave[0]);

                    ddt = new Date(dConvert);

                    if (!isValidDate(ddt)) {
                        ddt = moment(dConvert, 'DD/MM/YYYY').toDate();
                    }

                    let dataEmit = {
                        'address': addressSave[0] ?? '',
                        'datetime': ddt ?? new Date(),
                        'items': itemSave ?? [],
                        'total': totalUniq ?? '',
                        'dateTimeExtract': new Date(),
                        'dateTimeUpdate': new Date(),
                        'imageResult': imgResultSave ?? []
                    }

                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        url: "/api/create-invoice",
                        data: JSON.stringify(dataEmit),
                        success: (res) => {
                            alert('done', res);
                            $('#file-1').prop('disabled', false);
                        },
                        error: (err) => {
                            console.log('tạo hóa đơn thất bại', err);
                            $('#file-1').prop('disabled', false);
                        }
                    });

                }).catch(err => {
                    console.log('request xử lý trích xuất thất bại', err);
                    $('#file-1').prop('disabled', false);
                });
            },
            error: (err) => {
                console.log('requets predict thất bại', err);
                $('#file-1').prop('disabled', false);
            }
        });
    });


    let getResultToStore = async (data) => {
        if (data.error) {
            alertify.notify(`do not extract. Reload page to solve`, 'error', 15);
            return;
        }
        let resultToStored = {}
        if (data.files) {
            let result = data.files;
            console.log(result);
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
            let htmlSlideBox = '<div class="owl-carousel d-flex owl-theme">'
            if (imgWithBox) {
                for (const img of imgWithBox) {
                    htmlSlideBox += `<div>
                                                <img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image">
                                        </div>`;
                }
                resultToStored['imgResult'] = imgWithBox;
            }
            htmlSlideBox += '</div>';
            $('#slide-img-box').html(htmlSlideBox);
            $("#slide-img-box>.owl-carousel").owlCarousel({
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


            let htmlSubImage = '<div class="owl-carousel d-flex owl-theme">';
            if (address) {
                for (const img of address) {
                    htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                }
                let rsAdress = await startExtractInfo(address, '#address-show', 'Address', '#log-address');
                // console.log(rsAdress, 'address ------------------------');
                resultToStored['address'] = rsAdress;
            }
            if (datetime) {
                for (const img of datetime) {
                    htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                }
                let rsDatetime = await startExtractInfo(datetime, '#date-time-show', 'DateTime', '#log-date-time');
                // console.log(rsDatetime, 'datetime  ------------------------');
                resultToStored['datetime'] = rsDatetime;
            }
            if (item) {
                for (const img of item) {
                    htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                }
                let rsItem = await startExtractInfo(item, '#detail-show', 'item', '#log-detail');
                // console.log(rsItem, 'item  ------------------------');
                resultToStored['item'] = rsItem;
            }
            if (total) {
                for (const img of total) {
                    htmlSubImage += `<div class="item mx-3"><img class="col-12 p-0 img-sub" src="data:image/jpeg;base64, ${img}" alt="target image"></div>`;
                }
                rsTotal = await startExtractInfo(total, '#total-show', 'Total', '#log-total');
                // console.log(rsTotal, 'total  ------------------------');
                resultToStored['total'] = rsTotal;
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
        $('#sub-image-extracted .owl-carousel .owl-stage-outer').removeClass('customCARO').addClass('customCARO');
        $(".fas").removeClass('fa-spinner fa-spin');
        $(".fas").addClass('fa-check');
        $('#content-pro-add').text('');

        // console.log('tai sao o day lai bị miss', resultToStored);
        return resultToStored;

    };

    let startExtractInfo = async (listFile, idShow, label, idShowLog) => {
        labelLanguage = $("#langsel").val();
        listResult = [];

        let data = await Promise.all(listFile.map(async (file) => {
            let data = await worker.recognize('data:image/jpeg;base64,' + file, labelLanguage)
                .progress((packet) => {
                    processStatus(packet, label, idShowLog, idShow);
                });

            try {
                const dataProcess = data.lines.map(line => line.text);
                let textStandard = data.text;
                if (label === 'item') {
                    textStandard = data.lines;
                    linePrice = textStandard.splice(textStandard.length - 1, 1);
                    nameItem = '';
                    textStandard = textStandard.map(ele => ele.text);
                    nameItem = textStandard.join(' ');

                    linePrice = linePrice[0].text.split(' ');
                    price = linePrice[linePrice.length - 1];

                    // textStandard = {
                    //     'item name': nameItem,
                    //     'price': price,
                    //     'line price': linePrice
                    // }
                    // textStandard = nameItem + 'Price is: ' + price;
                    textStandard = nameItem;

                }

                const packet = { status: 'done', result: dataProcess, rs2: textStandard };
                let rs = processStatus(packet, label, idShowLog, idShow);
                console.log('tại sao mà mày cứ dồn cục lại vậy', rs, label);
                // listResult.push(rs);
                return rs;
            } catch (err) {
                alertify.notify(`There are some minor bugs happening, please reload the page to resolve this issue. Reason => ${err}`, 'warning', 15);
            }
        }))
        // listResult.push(data)
        console.log('list nhận dc', data);
        return data;
    };

    let processStatus = (packet, label, idShowLog, idShow) => {
        let logCurrent = $(idShowLog);
        switch (packet.status) {
            case 'loading tesseract core':
                if (packet.progress === 0) {
                    let line = `Start extract info on <span id="label-on-process">${label} image</span>
                                <div id="loading-tesseract-core">
                                    ${packet.status}
                                    <progress value="${packet.progress}" max="1"></progress>
                                </div>`;
                    // log.html(line);
                    logCurrent.html(line);
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

        const dataCurrent = new Object();
        dataCurrent[label] = texts;
        result = `<p style="font-size: 1.5rem; line-height: 1.2; font-weight: 500; color:#343343">${texts}<p>`
        dataCurrent[label] = texts;
        switch (label) {
            case "DateTime":
                result = `<p style="font-size: 1.5rem; line-height: 1.2; font-weight: 500; color:#343343">
                            ${convertDateTime(texts)}
                           <p>`
                // result = `<p style="font-size: 1.5rem; line-height: 1.2; font-weight: 500; color:#343343">
                //            convert from  ${convertDateTime(texts)}
                //            to ${moment(convertDateTime(texts)).toDate().toDateString()}
                //         <p>`
                break;
            case "Total":
                dataCurrent[label] = convertMoney(texts);
                result = `<p style="font-size: 1.5rem; line-height: 1.2; font-weight: 500; color:#343343">
                        ${convertMoney(texts)}
                        <p>`
                break;
        }
        $(idShow).append(result);
        return dataCurrent;

    };








    $(document).on('click', '#startLink', (e) => {
        e.preventDefault();
    });

    $(document).on('click', '.logout', (e) => {
        e.preventDefault();
        // window.location = 'http://localhost:3000/authen/logout'
        window.location = '/authen/logout'
    });

    $('#user').click((e) => {
        e.preventDefault();
        // window.location = 'http://localhost:3000/api/info-user';
        window.location = '/api/info-user';
    });

    $('#homePage').click((e) => {
        e.preventDefault();
        // window.location = 'http://localhost:3000/';
        window.location = '/';
    });

    $('#list-invoice').click((e) => {
        e.preventDefault();
        // window.location = 'http://localhost:3000/api/list-invoice';
        window.location = '/api/list-invoice/1';
    });

    $('button[edit]').click(function () {

        $('#if :input').prop('disabled', false);
        $('#if :input').prop('readonly', false);
        $(this).attr('disabled', true)
    });

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

        // orifin url: http://localhost:3000/api/update-info-user
        if ((data.email.trim()).length > 0) {
            $.ajax({
                type: "POST",
                url: "/api/update-info-user",
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
    });

    $('button[cancel]').click((e) => {
        // window.location = 'http://localhost:3000/api/info-user';
        window.location = '/api/info-user';
    });


    $("#slide-list-img-result>.owl-carousel").owlCarousel({
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


    $(document).on('click', '.delete-item', (e) => {
        const idDel = $(e.target).attr('idDel');
        $.ajax({
            url: '/api/delete-invoice',
            method: 'delete',
            data: {
                itemid: idDel
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                alertify.notify(`Deleted. Reload page to solve`, 'success', 15);
                $(`#inv-item-${idDel}`).remove();
                location.reload();
            },
            error: (err) => {
                alertify.notify(`do not delete. Reload page to solve`, 'error', 15);
                console.log(err);
            }
        })
    });

    $(document).on('click', '.save-item-modal', (e) => {
        let btn = e.target;
        let val = $(e.target).attr('idinvoice');
        console.log(btn);

        id1 = `address-item-${val}`;
        id2 = `datetime-item-${val}`;
        // id = `product-item-${index}-${val._id}`
        id3 = `items-edit-${val}`;
        id4 = `total-item-${val}`;

        let address = $(`#${id1}`).val()
        let datetime = $(`#${id2}`).val()
        let items = $(`#product-form-${val} textarea`);


        let itemsSave = [];
        for (let i = 0; i < items.length; i++) {
            let bb = items[i];

            itemsSave.push($(items[i]).val());
        }

        let total = $(`#${id4}`).val();
        // total = convertMoney(total);
        // let dataEmit = {
        //     'idUpdate': val,
        //     'address': address ?? '',
        //     'datetime': datetime ?? '',
        //     'items': itemsSave ?? [],
        //     'total': total ?? '',
        //     'dateTimeUpdate': new Date(),
        // }
        total = convertMoney(total);

        // dateTime = moment(convertDateTime(datetime)).toDate();



        let dataEmit = {
            'idUpdate': val,
            'address': address ?? '',
            'datetime': new Date(datetime) ?? new Date(),
            'items': itemsSave ?? [],
            'total': total ?? '',
            'dateTimeUpdate': new Date(),
        }
        console.log(dataEmit);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            url: "/api/update-invoice",
            data: JSON.stringify(dataEmit),
            success: (res) => {
                console.log('ok', res);
                alertify.notify(`Update success fully. :) `, 'success', 15);
                // $(`#modal-item-${val}`).modal('hide');
                // window.location = '/api/list-invoice';
                location.reload();
            },
            error: (err) => {
                alertify.notify(`do not save. Reload page to solve`, 'error', 15);
                window.alert('Do not save. Reload page to solve');
            }
        });

    });



    let convertDateTime = (dateString) => {
        let date = '(3[01]|[12][0-9]|0?[1-9])';
        let month =
            '(1[012]|0?[1-9]|January|February|March|April|May|June|July|August|September|October|November|December|Oct|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Nov|Dec)';
        let year = '(\\d{4})';
        let splitter = '([.-/, ]+)';

        let reT1 = '(' + date + splitter + month + splitter + year + ')';
        let reT2 = '(' + date + splitter + year + splitter + month + ')';
        let reT3 = '(' + month + splitter + date + splitter + year + ')';
        let reT4 = '(' + month + splitter + year + splitter + date + ')';
        let reT5 = '(' + year + splitter + month + splitter + date + ')';
        let reT6 = '(' + year + splitter + date + splitter + month + ')';

        let re = new RegExp(
            reT1 + '|' + reT2 + '|' + reT3 + '|' + reT4 + '|' + reT5 + '|' + reT6,
            'g'
        );

        dateString = dateString.match(re);
        dateString = dateString[dateString.length - 1];
        return dateString;
    }

    let convertMoney = (moneyString) => {
        let moneyT2 = '()((\\d{1,3}[.,]*)(\\d{1,3}[.,]?){0,3}\\d{3})';
        let money = moneyT2;
        let re = new RegExp(money, 'g');
        moneyString = moneyString.replace(/ /g, '');
        moneyString = moneyString.replace(/\./g, ',');
        moneyString = moneyString.replace(/,/g, ',');
        moneyString = moneyString.match(re);
        moneyString = moneyString[moneyString.length - 1];
        return moneyString;
    }

    function isValidDate(d) {
        if (Object.prototype.toString.call(d) === "[object Date]") {
            // it is a date
            if (isNaN(d.getTime())) {  // d.valueOf() could also work
                // date is not valid
                return false;
            } else {
                // date is valid
                return true;
            }
        } else {
            // not a date
            return false;
        }
        // return d instanceof Date && !isNaN(d);
    }
});