$(document).ready(function () {
    moment.locale('pt-BR');
    data = moment(new Date()).format("DD/MM/YYYY")
    $('#txtData').val(`${moment(new Date()).format("YYYY-MM-DD")}`)
    //OBTER SETORES
    var setores = []
    var jqxhrs = $.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/GetAllSectors", function (data) {
        $(data).each(function (i) {
            setores.push(`${data[i].SetorNome}`)
        });
    }).done(function () {
        setores.forEach(function (item) {
            $('#selectSetor').append('<option>' + item + '</option>');
        });
    });
    //
    //OBTER TIPOS DE EQUIPAMENTOS
    var tipoEquipamentos = []
    var jqxhrs = $.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/GetEquipamentTypes", function (data) {
        $(data).each(function (i) {
            tipoEquipamentos.push(`${data[i].Nome}`)
        });
    }).done(function () {
        tipoEquipamentos.forEach(function (item) {
            $('#selectTipoEquipamento').append('<option>' + item + '</option>');
        });
    });
    //
    $("#btnSalvar").click(function () {
        var params = {
            "Registro": moment($('#txtData').val()).format(),
            "Setor": $('#selectSetor').val(),
            "Equipamento": $('#selectTipoEquipamento').val(),
            "Modelo": $('#txtModelo').val(),
            "Patrimonio": $('#txtPatrimonio').val(),
            "SerialNumber": $('#txtNs').val(),
            "Obs": $('#txtObs').val(),
            "UserId": client.auth.user.id
        }
        var jqxhr = $.post("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/registros-Save", params, function (data) {

        }).done(function (result) {
            alert(`${result.msg}`)
            window.location.href = "index.html"
        });
    });
    $('#txtData').change(function () {
        data = moment($(this).val()).format("DD/MM/YYYY")
    });
});