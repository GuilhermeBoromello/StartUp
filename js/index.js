$('.loading-spinner').addClass('active'); // ativa o loading
$(document).ready(function () {
    function loadEquipamentTypes(tipoEquipamentos) {
        for (let item of tipoEquipamentos) {
            $('#selectTipoEquipamento').append('<option>' + item + '</option>');
        }
    }

    getEquipamentTypes(loadEquipamentTypes);

    var registros = [];
    var registrosFiltrados = [];
    var registrosFiltradosOrdenados = [];
    var html = ``;

    var params = {
        UserId: client.auth.user.id
    }

    $('#imgUsuario').attr(`src`, `${client.auth.user.profile.pictureUrl}`);
    $('#navbarUsuario').append(`${client.auth.user.profile.name}`);

    $('#txtData').val(`${moment(new Date()).format("YYYY-MM-DD")}`)
    var jqxhr = $.get("https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/registros-GetAll", params, function (data) {
        $(data).each(function (i) {
            var oItem = {
                Id: data[i]._id.$oid,
                Data: moment(new Date(parseInt(data[i].Registro.$date.$numberLong))).format("DD/MM/YYYY"),
                Setor: data[i].Setor,
                Equipamento: data[i].Equipamento,
                Modelo: data[i].Modelo,
                Patrimonio: data[i].Patrimonio,
                SerialNumber: data[i].Ns,
                Obs: data[i].Obs
            }
            registros.push(oItem)
        });
    }).done(function () {
        Listar(`${moment(new Date()).format("MM/YYYY")}`)
        $('.loading-spinner').removeClass('active'); // desativa o loading
    });

    //#region Listar
    function Listar(periodo) {
        registrosFiltrados.length = [];
        registrosFiltradosOrdenados.length = [];
        //Separa os registros do mês selecionado
        for (var i = 0; i < registros.length; i++) {
            registrosFiltrados.push(registros[i]);
        }
        for (var i = 1; i < 32; i++) {
            var diaS = ``;
            if (i < 10) {
                diaS = `0${i}`;
            } else {
                diaS = `${i}`;
            }
            for (var j = 0; j < registrosFiltrados.length; j++) {
                if (registrosFiltrados[j].Data.substring(0, 2) === diaS) {
                    if ($("#selectTipoEquipamento option:selected").text() == "TODOS") {
                        registrosFiltradosOrdenados.push(registrosFiltrados[j]);
                    } else {
                        if (registrosFiltrados[j].Equipamento.toUpperCase() === $("#selectTipoEquipamento option:selected").text()) {
                            registrosFiltradosOrdenados.push(registrosFiltrados[j]);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < registrosFiltradosOrdenados.length; i++) {
            var id = registrosFiltradosOrdenados[i].Id
            var data = registrosFiltradosOrdenados[i].Data
            var setor = registrosFiltradosOrdenados[i].Setor
            var equipamento = registrosFiltradosOrdenados[i].Equipamento
            var modelo = registrosFiltradosOrdenados[i].Modelo
            var patrimonio = registrosFiltradosOrdenados[i].Patrimonio
            var numerodeSerie = registrosFiltradosOrdenados[i].SerialNumber
            var obs = registrosFiltradosOrdenados[i].Obs
            html += `<tr class="felix">`;
            html += `<td>${setor}</td>
            <td>${equipamento}</td>
            <td>${modelo}</td>
            <td>${data}</td>
            <td>${patrimonio}</td>
            <td>${numerodeSerie}</td>
            <td><a href="edit.html?${id}">Editar</a></td>
            <td><a href="#" id="deleteAlert">Excluir</a></td></tr>`;
        };
        $('#tabelaRegistros').append(html);
        html = ``;
        $('#txtTotalRegistros').text(`Total de Registros : ${registrosFiltradosOrdenados.length}`);
    }
    //#endregion

    $("#selectTipoEquipamento").change(function () {
        var str = "";
        $("select option:selected").each(function () {
            str += $(this).text() + " ";
        });
        $('#tabelaRegistros .felix').remove();
        Listar(`${moment(new Date()).format("MM/YYYY")}`)
    }).change();

    var clickedId = ``;
    $(document).on("click", "#deleteAlert", function () {
        if (confirm(`Deseja excluir o registro?`)) {
            var password = prompt("Digite a senha : ")
            $.ajax({
                url: `https://webhooks.mongodb-realm.com/api/client/v2.0/app/hosptrade-hgcc-bwoyf/service/HospTrade-HGCC/incoming_webhook/registros-Delete?_id=${clickedId}&password=${password}`,
                type: 'DELETE',
                success: function (result) {
                    // Do something with the result
                    alert('Registro excluido com sucesso)))')
                    window.location.href = "index.html";
                }
            });
        } else {

        }
    });

    $("#tabelaRegistros").on("click", "tbody tr", function () {
        if ($(this).index() > 4) {/*4 - QUANTIDADE DE LINHAS ANTES DO CABEÇALHO DA TABLE COMEÇANDO A CONTAR DE 0*/
            clickedId = `${registrosFiltradosOrdenados[$(this).index() - 5].Id}`;/*5 - ADICONE MAIS 1 AO NÚMERO ANTERIOR*/
        }
    });
});