alertify.set('notifier', 'position', 'top-right');



function log(message, dateFrom, dateTo, df, dt) {


    dateSelect = ` 
                <div style="text-align: center;
					font-size: 1.2rem;" dataD='${df}==${dt}'>
                    <span class="badge badge-success"  
                            style="padding: 0.5rem 0.3rem;
                                    margin: 0.5rem 0 0 0;">
                            ${dateFrom}
                    </span>
                    <span class="badge badge-light" 
                        style="padding: 0.5rem 0.3rem;margin: 0.5rem 0 0 0;">
                        <i class="fas fa-angle-double-right"></i> 
                    </span> 
                    <span class="badge badge-success"  
                        style="padding: 0.5rem 0.3rem;margin: 0.5rem 0 0 0;">
                        ${dateTo}
                    </span>
                </div>
                `;
    $('#loggerTxt').html(dateSelect);
    isRange = false;
    var difference = dt - df;
    dffDays = Math.abs(difference);
    dffDays = dffDays / (1000 * 3600 * 24)
    console.log(dffDays);
    if (dffDays > 30 || dffDays < 1) {
        console.log('ko ok');
        isRange = false;
        alertify.notify(`You can only make statistics for about 30 days`, 'error', 15);
        $("#sati").removeClass("btn-outline-success").addClass("btn-outline-secondary");
    } else {
        console.log('ok nhha');
        isRange = true;
        $("#sati").removeClass("btn-outline-secondary").addClass("btn-outline-success");
    }
    $("#sati").prop("disabled", !isRange);


}
window.onload = function () {
    document.querySelector('#date-sati').addEventListener('datechanged', function (e) {
        const dateFrom = new Date(e.data._dateFrom);
        const dateTo = new Date(e.data._dateTo);
    });

    duDatepicker('#date-sati', {
        format: 'mm/dd/yyyy',
        range: true,
        clearBtn: true,
        theme: 'green',
        maxDate: 'today',
        events: {
            dateChanged: function (data) {
                log('From: ' + data.dateFrom + '\nTo: ' + data.dateTo, `From ${data.dateFrom}`,
                    `To ${data.dateTo}`, new Date(data._dateFrom), new Date(data._dateTo))
            },

        }
    });



}

$(document).ready(function () {
    console.log($('.update-datetime'));
    $('.update-datetime').each(element => {
        let id = $($('.update-datetime')[element]).attr('id');
        let Dvalue = $(`#${id}`).val();
        duDatepicker(`#${id}`, 'setValue', moment(Dvalue).format('L'));
    });
    $('.update-datetime').on('click', (e) => {
        // e.preventDefault();
        // alert('ádasdasd');
        let id = $(e.target).attr('id');
        // let Dvalue = $(`#${id}`).val();
        // console.log(moment(Dvalue).format('L'));
        // duDatepicker(`#${id}`, 'setValue', moment(Dvalue).format('L'));
        // $(`#${id}`).trigger("click");
        duDatepicker(`#${id}`, {
            auto: true,
            inline: true,
            theme: 'green',
            maxDate: 'today',
        })
        document.querySelector(`#${id}`).addEventListener('datechanged', function (e) {
            console.log('ngayf ddax chonj ', e.data, this.value)
            console.log(new Date(this.value));
        })
    })


});
$(document).on('click', '#sati', (e) => {
    e.preventDefault();
    alert('ok');
    data = $('#loggerTxt> div').attr('dataD');
    data = data.split('==');
    dateFrom = moment(data[0]).format('L');
    dateTo = moment(data[1]).format('L')
    console.log(dateFrom, '===========', dateTo);
    window.location = `/api/sati?datefrom=${dateFrom}&dateto=${dateTo}`;
    // $.ajax({
    //     type: "get",
    //     url: `/api/sati?datefrom=${dateFrom}&dateto=${dateTo}`,
    //     dataType: "json",
    //     success: (res) => {
    //         console.log(res);
    //     },
    //     error: (err) => {
    //         console.log(err);
    //     }
    // });


})



function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
}