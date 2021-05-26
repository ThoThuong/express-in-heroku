// const { Promise } = require("mongoose");

/**
 * 
 * @param {*} imgFile : cho vào cái file mới lấy lên
 * @param {*} idShowImg : cái id chỗ để show cái hình sau khi xử lý quay nó về đúng hướng
 * @param {*} maxWidthImg : kich thước chiều rộng của tấm hình
 * @returns trả về phần tử img có thể gắn lên giao diện luôn
 * @ note1: Ở đây là nó show cái hình lên bằng cách sử dụng URL.createObjectURL(newBlob); với cái blob
 * @ note2: Cái file muốn show lên cũng phải sử dụng hàm này thì suy ra là cái blob nó cũng là cái file
 * @ note3 Theo tài liệu thì cái blob nó cũng là cái file nhưng nó bị thiếu thuộc tính lastMobifiedDate và name
 * @ note4: Nhưng đẻ ý thì cái blob nó vẫn có các thuộc tính trên
 */
const processImgOnMobilev2 = function (imgFile, idShowImg, maxWidthImg) {
    return loadImage(
        imgFile,
        function (img, data) {
            if (data.imageHead && data.exif) {
                // Reset Exif Orientation data:
                loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
                return img.toBlob(function (blob) {
                    return loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                        // do something with newBlob
                        let img4blob = new Image();
                        img4blob.src = URL.createObjectURL(newBlob);
                        document.querySelector(idShowImg).appendChild(img4blob);
                        return newBlob;
                    })
                }, 'image/jpeg');
            }
            return img;
        },
        { meta: true, orientation: true, canvas: true, maxWidth: maxWidthImg }
    );
};


/**
 * 
 * hàm này đọc lên một tấm hình bị xoay và lần lượt xứt lý và in ra kết quả các bước
 * bước cuối cùng thì nó không bị xoay
 */
const processImgOnMobilev1 = function (imgFile, id1 = '#test-img-1', id2 = '#test-img-2', id3 = '#test-img-3') {
    loadImage(imgFile, { meta: true, canvas: true, maxWidth: 800, orientation: 1 })
        .then(function (data) {
            console.log('hình qua xử lý lần1', data, 'cái hình hiện tại là cái này', data.image)
            if (!data.imageHead) throw new Error('Could not parse image metadata');
            return new Promise(
                function (resolve) {
                    data.image.toBlob(function (blob) {
                        data.blob = blob;
                        let imgblob1 = new Image();
                        imgblob1.src = URL.createObjectURL(data.blob);
                        document.querySelector(id1).appendChild(imgblob1);
                        resolve(data);
                    }, 'image/jpeg');
                });
        })
        .then(function (data) {
            console.log('hình sau khi xử lý ', data);
            // let imageBlob = loadImage.replaceHead(data.blob, data.imageHead);
            let imageBlob2 = new Image();
            imageBlob2.src = URL.createObjectURL(data.blob);
            document.querySelector(id2).appendChild(imageBlob2);
            return loadImage.replaceHead(data.blob, data.imageHead);
        })
        .then(function (blob) {
            // do something with the new Blob object
            console.log('cái hình kiểu blob', blob)
            var imageBlob = new Image();
            imageBlob.src = URL.createObjectURL(blob);
            document.querySelector(id3).appendChild(imageBlob);
        })
        .catch(function (err) {
            console.error(err)
        });
}

/**
 * 
 * @param {*} imgFile cho vào một cái file đọc lên từ folder hoặc máy ảnh
 * @returns trả về từ cái blob
 */
const processImgOnMobilev1_3 = async function (imgFile) {
    return await loadImage(imgFile, { meta: true, canvas: true, orientation: 1 })
        .then(function (data) {
            if (!data.imageHead) throw new Error('Could not parse image metadata');
            return new Promise(
                function (resolve) {
                    data.image.toBlob(function (blob) {
                        data.blob = blob;
                        resolve(data);
                    }, 'image/jpeg');
                });
        })
        .then(function (data) {
            return loadImage.replaceHead(data.blob, data.imageHead);
        })
        .then(function (blob) {
            // do something with the new Blob object
            return blob
        })
        .catch(function (err) {
            console.error(err, 'error process img blob');
            return err;
        });
}

/**
 * 
 * @param {*} imgFile cho vào mổ cái file hình, đọc lên từ folder hoặc máy ảnh
 * @returns trả về một emlemt img có thể show lên giao diện luôn
 */
const processImgOnMobilev3 = function (imgFile) {
    return loadImage(
        imgFile,
        function (img, data) {
            if (data.imageHead && data.exif) {
                // Reset Exif Orientation data:
                loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
                return img.toBlob(function (blob) {
                    return loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                        return newBlob;
                    })
                }, 'image/jpeg');
            }
            return img;
        },
        { meta: true, orientation: true, canvas: true }
    );
};

const processImgOnMobilev4 = function (imgFile) {
    return loadImage(
        imgFile,
        function (img, data) {
            if (data.imageHead && data.exif) {
                // Reset Exif Orientation data:
                loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
                return img.toBlob(function (blob) {
                    return loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                        // do something with newBlob
                        return newBlob;
                    })
                });
            }
            return img;
        },
        { meta: true, orientation: true }
    );
};
///////
const playWithImage = (file) => {

    /**
     * 
     */
    processImgOnMobilev1(file);


    /**
     * 
     */
    processImgOnMobilev2(file, '#test-img-4', 800);


    /**
     * 
     */
    let unknowImgType = processImgOnMobilev3(file);
    document.querySelector('#test-img-5').appendChild(unknowImgType);


    /**
     * 
     */
    let blpbImgAfterProcessRotated = processImgOnMobilev1_3(file);
    let imageFromBlobAfterProcess = new Image();
    imageFromBlobAfterProcess.src = URL.createObjectURL(blpbImgAfterProcessRotated);
    document.querySelector('#test-img-6').appendChild(imageFromBlobAfterProcess);

}


////
function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
const getBlobFromELment = async (elementFile) => {
    let _src = elementFile.src;
    let blob = await fetch(_src)
        .then((res) => res.blob())
        .then((myBlob) => {
            console.log('blob lấy dược từ element in promise');
            console.log(myBlob);
            // logs: Blob { size: 1024, type: "image/jpeg" }
            return myBlob;
        });
    return blob;
}

const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

const showImgGeneral = (listFile, idShow = '#slide-img-box') => {
    let htmlSlideBox = '<div class="owl-carousel d-flex owl-theme">'
    for (let i = 0; i < listFile.length; i++) {
        htmlSlideBox += `<div>
                                    <img class="col-12 p-0 img-sub" src="${URL.createObjectURL(listFile[i])}" alt="target image">
                                </div>`;
    }
    htmlSlideBox += '</div>';
    $(idShow).html(htmlSlideBox);
    $(`${idShow}>.owl-carousel`).owlCarousel({
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

$(function () {
    const corePath = window.navigator.userAgent.indexOf("Edge") > -1
        ? '/javascripts/provider/tesseract-core.asm.js'
        : '/javascripts/provider/tesseract-core.wasm.js';
    const worker = new Tesseract.TesseractWorker({
        corePath,
    });
    alertify.set('notifier', 'position', 'top-right');

    $(document).on('change', '#file-1', async (e) => {
        if (e.target.files.length > 0) {
            //==============start test process stu img=================
            // processImgOnMobilev1(e.target.files[0]);
            // let img5Blob = processImgOnMobilev2(e.target.files[0], '#test-img-4', 800);
            // document.querySelector('#test-img-5').appendChild(img5Blob);
            // ==========end test process stu img============================

            // console.log('kiểm tra các trường hợp',);
            // processImgOnMobilev3();
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
                showImgGeneral(e.target.files, '#slide-img-box');
            } else {
                var htmlOneNew = `<div id='img-box'>
                                        <img id="selected-image" class="col-12 p-0" src="---null" alt="target image"/>
                                    </div>`;
                $('#slide-img-box').html(htmlOneNew);
                const selectedImage = document.getElementById('selected-image');
                file = e.target.files[0];
                if (file) {
                    selectedImage.src = URL.createObjectURL(file);
                }
                let dataFiles = new FormData();
                dataFiles.append('image', file);
                emitData = dataFiles;



                // playWithImage(e.target.files[0]);


            }

            $("#arrow-right").removeClass("fa-arrow-right");
            $("#arrow-right").addClass("fa-spinner fa-spin");
            $("#arrow-down").removeClass("fa-arrow-down");
            $("#arrow-down").addClass("fa-spinner fa-spin");
            $('#content-pro-add').text(`Recognizing Object`);
            $('#date-time-show').html('');
            $('#detail-show').html('');
            $('#total-show').html('');
            $('#address-show').html('')


            // origin url 'http://127.0.0.1:5000/api/test'
            // 192.168.1.5
            //'https://nobugnocode.com/api/test',
            //'http://127.0.0.1:5000/api/test',
            //'http://175.41.143.61/api/test',\
            $.ajax({
                type: "POST",
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: 'http://127.0.0.1:5000/api/predict',
                data: emitData,
                contentType: false,
                processData: false,
                crossDomain: true,
                dataType: 'json',
                success: (data) => {
                    getResultToStore(data).then((data) => {
                        const { address, datetime, item, total, imgResult } = data;
                        // console.log('sai từ ở đây', data); // //important
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

                        let totalSave = [''];
                        if (total[0]) {
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
                        // console.log('casi hinh nay may ', imgResultSave);  //important
                        // let dataEmit = {
                        //     'address': addressSave[0] ?? '',
                        //     'datetime': datetimeSave[0] ?? '',
                        //     'items': itemSave ?? [],
                        //     'total': totalSave[0] ?? '',
                        //     'dateTimeExtract': new Date(),
                        //     'dateTimeUpdate': new Date(),
                        //     'imageResult': imgResultSave ?? []
                        // }
                        // ;
                        totalUniq = '';
                        if (totalSave[0].length > 0) {
                            totalUniq = convertMoney(totalSave[0]);
                        }

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

                        // console.log('xử lý sai thông tin để mà lưu ', dataEmit);  //important

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
                                // console.log('tạo hóa đơn thất bại', err);  //important
                                alertify.notify(`create info invoice failed`, 'error', 15);
                                $('#file-1').prop('disabled', false);
                            }
                        });

                    }).catch(err => {
                        // console.log('request xử lý trích xuất thất bại', err);  //important
                        alertify.notify(`Predict request failed`, 'error', 15);
                        $('#file-1').prop('disabled', false);
                    });
                },
                error: (err) => {
                    // console.log('requets predict thất bại', err); // //important
                    alertify.notify(`Requets predict thất bại failed`, 'error', 15);
                    $('#file-1').prop('disabled', false);
                }
            });
        }
    });


    let getResultToStore = async (data) => {
        if (data.error) {
            alertify.notify(`do not extract. Reload page to solve`, 'error', 15);
            return;
        }
        let resultToStored = {}
        if (data.files) {
            let result = data.files;
            // console.log(result); // //important
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
                // console.log(rsTotal, 'total  ------------------------'); // //important
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

        // console.log('tai sao o day lai bị miss', resultToStored); //important
        return resultToStored;

    };

    let startExtractInfo = async (listFile, idShow, label, idShowLog) => {
        labelLanguage = $("#langsel").val();
        listResult = [];

        let data = await Promise.all(listFile.map(async (file) => {


            try {
                let data = await worker.recognize('data:image/jpeg;base64,' + file, labelLanguage)
                    .progress((packet) => {
                        processStatus(packet, label, idShowLog, idShow);
                    });
                //console.log(data, label, "lỗi do total không có line nào"); //imporatnt
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
                    textStandard = nameItem;

                }

                const packet = { status: 'done', result: dataProcess, rs2: textStandard };
                let rs = processStatus(packet, label, idShowLog, idShow);
                // console.log('tại sao mà mày cứ dồn cục lại vậy', rs, label);
                // listResult.push(rs);
                return rs;
            } catch (err) {
                alertify.notify(`Here some unexpected exceptions occurred, because the image is too small, the image is noisy. Response => ${err}`, 'Reload page to solve', 'warning', 15);
            }
        }))
        // listResult.push(data)
        // console.log('list nhận dc để lưu ', data); important
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
                // console.log(convertMoney(texts), '---------------', texts, 'lỗi do convert không dc');  //important
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
        $('#email').prop('disabled', true);
        $('#email').prop('readonly', true);
        duDatepicker('#birthDay', {
            format: 'mm/dd/yyyy',
            range: false,
            clearBtn: true,
            theme: 'green',
            maxDate: 'today',
            events: {

            }
        });
    });

    $('button[save]').click(async (e) => {
        const dt = $('#if :input').map(function () {
            keya = $(this).attr('id');
            value = $(this).val();
            if (keya === 'male' || keya === 'female') {
                value = $(`input[id='${keya}']:checked`).val();
                keya = 'gender';
            }
            if (value !== undefined) {
                objCurrent = new Object();
                objCurrent[keya] = value;
            }
            return objCurrent
        }).get();
        // console.log(dt, 'data lấy xuống');//important
        dt.splice(7, 3);
        // console.log(dt, 'data cắt');//important
        const data = dt.reduce((previous, current) => {
            key = Object.keys(current)[0];
            previous[key] = current[key];
            return previous;
        }, {});
        // console.log(data, $('#idUserCurrent').val(), 'data ổn định');//important
        // let dataSmaple = {
        //     "id": "60a8df8d4c64c0031c0ffedd",
        //     "data": {
        //         "fullname": "Trần Ngọc  Thương postman",
        //         "email": "nathuong99@gmail.com",
        //         "sdt": "0398009678",
        //         "birthDay": "11/19/1999",
        //         "gender": "male",
        //         "address": "497/24, phan văn trị"
        //     }
        // };//important
        let dataEmit = {
            'id': $('#idUserCurrent').val(),
            'data': {
                "fullname": data.fullname ? data.fullname : "",
                "email": data.email ? data.email : '',
                "sdt": data.sdt ? data.sdt : '',
                "birthDay": data.birthDay ? data.birthDay : '',
                "gender": data.gender ? data.gender : '',
                "address": data.address ? data.address : ''
            }
        }
        // console.log('cái gửi đi', dataEmit);//important
        $.ajax({
            type: "POST",
            url: "/api/update-info-user",
            data: dataEmit,
            success: (res) => {
                location.reload();
                // $('.user-ac').attr('disabled', true);
                // $('#edit-us').attr('disabled', false);
                // $('#if :input').prop('disabled', true);
                // $('#if :input').prop('readonly', true);
                // alertify.notify('success', 'success', 5);
                // console.log(res);//important
            },
            error: (err) => {
                alertify.notify('error', 'error', 5);
            }
        });
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
                // console.log(res); //important
                alertify.notify(`Deleted. Reload page to solve`, 'success', 15);
                $(`#inv-item-${idDel}`).remove();
                location.reload();
            },
            error: (err) => {
                alertify.notify(`do not delete. Reload page to solve`, 'error', 15);
                // console.log(err);  //important
            }
        })
    });

    $(document).on('click', '.save-item-modal', (e) => {
        let btn = e.target;
        let val = $(e.target).attr('idinvoice');
        // console.log(btn);  //important

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
        // console.log(dataEmit);  //important
        $.ajax({
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            url: "/api/update-invoice",
            data: JSON.stringify(dataEmit),
            success: (res) => {
                // console.log('ok', res);  //important
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