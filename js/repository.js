function getEquipamentTypes(callback) {
    const tipoEquipamentos = []
    var jqxhrs = $.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/GetEquipamentTypes", function (data) {
        $(data).each(function (i) {
            tipoEquipamentos.push(`${data[i].Nome}`)
        });
    }).done(function () {
        callback(tipoEquipamentos);
    });
}