var protocol = location.protocol;
var slashes = protocol.concat("//");
var host = slashes.concat(window.location.hostname);

var nosamb_pelanggan = "";
var nama_pelanggan = "";
var service_access = "";
var tanggalNow = moment().format("YYYY-MM-DD");
var waktuNow = moment().format("H:m:s");
var tokenAccess = sha1("BSINFO." + tanggalNow + ".PDAM2017." + waktuNow);
var posisi = 0;
var imgkosong = "./upload/tmp/no_image_available.gif";

var urlAccess = host + "/--action/info-tagihan";

$.fancybox.helpers.overlay.open();
$.fancybox.showLoading();

$.get(urlAccess, function (data) {
  $.fancybox.helpers.overlay.close();
  $.fancybox.hideLoading();

  var dataResult = JSON.parse(data);
  service_access = dataResult.url_service;
});

var getPelanggan = function () {
  $.fancybox.helpers.overlay.open();
  $.fancybox.showLoading();

  nosamb_pelanggan = $("#id_nosamb_pelanggan").val();
  nama_pelanggan = $("#id_nama_pelanggan").val().toUpperCase();

  var urlPelanggan =
    service_access +
    "api/pelanggan/" +
    tokenAccess +
    "/" +
    nosamb_pelanggan +
    "/" +
    nama_pelanggan +
    "/" +
    tanggalNow +
    "." +
    waktuNow;
  // 		console.log(urlAccess);

  $.get(urlPelanggan, function (data) {
    $.fancybox.helpers.overlay.close();
    $.fancybox.hideLoading();

    var dataResult = JSON.parse(data);
    console.log(dataResult);
    if (dataResult.mssg == "oke") {
      $(".nosamb_pelanggan").text("").append(dataResult.data.nosamb);
      $(".nama_pelanggan").text("").append(dataResult.data.nama);
      $(".alamat_pelanggan").text("").append(dataResult.data.alamat);
      $(".total_pelanggan")
        .text("")
        .append("Rp. " + $.number(dataResult.data.totaltagihan, 2, ",", "."));
    } else {
      $(".nosamb_pelanggan").text("");
      $(".nama_pelanggan").text("");
      $(".alamat_pelanggan").text("");
      $(".total_pelanggan").text("");
    }

    getTagihan(); //memanggil fungsi get tagihan
    getFotoKelainan();
  });

  $("#allInfoTagihan").show();
};

var nextFotoKelainan = function () {
  posisi++;

  getFotoKelainan();
};

var prevFotoKelainan = function () {
  if (posisi == 0) {
  } else {
    posisi--;
    getFotoKelainan();
  }
};

var getFotoKelainan = function () {
  var batas = 3;
  var limit = posisi + "." + batas;
  var urlFotoKelainan =
    service_access +
    "api/fotokelainan/" +
    tokenAccess +
    "/" +
    nosamb_pelanggan +
    "/" +
    limit +
    "/" +
    tanggalNow +
    "." +
    waktuNow;

  $.fancybox.helpers.overlay.open();
  $.fancybox.showLoading();
  $("#place-foto-kelainan").text("");
  $("#loading-image-foto").show();

  console.log(urlFotoKelainan);
  $.get(urlFotoKelainan, function (data) {
    var dataResult = JSON.parse(data);
    console.log(dataResult);
    $("#loading-image-foto").hide();

    if (dataResult.mssg == "oke") {
      var dataFotoKelainan = dataResult.data;
      var tabelFotoKelainan = "";

      for (var i = 0; i < dataFotoKelainan.length; i++) {
        var dataPeriode =
          getBulan(dataFotoKelainan[i].periode.substr(4, 2)) +
          " " +
          dataFotoKelainan[i].periode.substr(0, 4);

        var imgLoadFotoKelainan =
          "data:image/;base64," + dataFotoKelainan[i].gbrbase64;
        var fotoDisplay =
          dataFotoKelainan[i].gbrbase64 == "-" ||
          dataFotoKelainan[i].gbrbase64 == ""
            ? imgkosong
            : imgLoadFotoKelainan;
        var statusDetailFoto =
          dataFotoKelainan[i].gbrbase64 == "-" ||
          dataFotoKelainan[i].gbrbase64 == ""
            ? "kosong"
            : "ada";

        if (statusDetailFoto == "ada") {
          tabelFotoKelainan =
            '<div class="placeFotoStan">' +
            '<div class="titleFotoKelainan">' +
            '<div class="col-md-5"><b>Periode : ' +
            dataPeriode +
            " <br> Stan Meter : " +
            dataFotoKelainan[i].stanskrg +
            " </b></div>" +
            '<div class="col-md-7"><b>Kelaian : ' +
            dataFotoKelainan[i].kelainan +
            " </b></div>" +
            "</div>" +
            '<a href="#" data-periade="' +
            dataFotoKelainan[i].periode +
            '" data-status="' +
            statusDetailFoto +
            '" class="btnShowDetailFoto">' +
            '<img src="' +
            fotoDisplay +
            '" style="width:100%;">' +
            "</a>" +
            "</div>";
        } else {
          tabelFotoKelainan =
            '<div class="placeFotoStan">' +
            '<div class="titleFotoKelainan">' +
            '<div class="col-md-5"><b>Periode : ' +
            dataPeriode +
            " <br> Stan Meter : 15737 </b></div>" +
            '<div class="col-md-7"><b>Kelaian : ' +
            dataFotoKelainan[i].kelainan +
            " </b></div>" +
            "</div>" +
            '<img src="' +
            fotoDisplay +
            '" style="width:100%;">' +
            "</div>";
        }
        $("#place-foto-kelainan").append(tabelFotoKelainan);
      }
    }

    $.fancybox.helpers.overlay.close();
    $.fancybox.hideLoading();
  });
};

$("body").on("click", ".btnShowDetailFoto", function () {
  $.fancybox.helpers.overlay.open();
  $.fancybox.showLoading();

  var periodeFoto = $(this).attr("data-periade");

  var urlDetailFotoKelainan =
    service_access +
    "api/detailfotostan/" +
    tokenAccess +
    "/" +
    nosamb_pelanggan +
    "/" +
    periodeFoto +
    "/" +
    tanggalNow +
    "." +
    waktuNow;

  $.get(urlDetailFotoKelainan, function (data) {
    $.fancybox.helpers.overlay.close();
    $.fancybox.hideLoading();

    var dataResult = JSON.parse(data);
    console.log(dataResult);

    if (dataResult.mssg == "oke") {
      var imgDetailFotoKelainan =
        "data:image/;base64," + dataResult.data.gbrbase64;
      var fotoDetailDisplay =
        dataResult.data.gbrbase64 == "-" || dataResult.data.gbrbase64 == ""
          ? imgkosong
          : imgDetailFotoKelainan;

      $("#bigImgFotoKelainan").attr("href", fotoDetailDisplay);
      $("#bigImgFotoKelainan").trigger("click");
    }
  });

  return false;
});

var getTagihan = function () {
  $.fancybox.helpers.overlay.open();
  $.fancybox.showLoading();

  var urlTagihan =
    service_access +
    "api/tagihan/" +
    tokenAccess +
    "/" +
    nosamb_pelanggan +
    "/" +
    nama_pelanggan +
    "/" +
    tanggalNow +
    "." +
    waktuNow;

  $.get(urlTagihan, function (data) {
    $.fancybox.helpers.overlay.close();
    $.fancybox.hideLoading();

    var dataResult = JSON.parse(data);
    console.log(dataResult);

    $("#place-tagihan").text("");

    if (dataResult.mssg == "oke") {
      var dataTagihan = dataResult.data;
      var tabelTagihan = "";
      for (var i = 0; i < dataTagihan.length; i++) {
        var dataPeriode =
          getBulan(dataTagihan[i].periode.substr(4, 2)) +
          " " +
          dataTagihan[i].periode.substr(0, 4);
        var bg_table;
        if (dataTagihan[i].flaglunas == "1") {
          bg_table = "bg-success";
        } else {
          bg_table = "bg-danger";
        }

        tabelTagihan =
          '<tr class="' +
          bg_table +
          '">' +
          "<td><b>" +
          dataPeriode +
          "</b></td>" +
          '<td align="left"><b>Rp. ' +
          $.number(dataTagihan[i].total, 2, ",", ".") +
          "</b></td>" +
          "<td>" +
          '<a href="#" class="cekDetailTagihan" indexTagihan="' +
          i +
          '" statusDetail="close" periodeTagihan="' +
          dataTagihan[i].periode +
          '">' +
          '<i class="fa fa-calculator text-info"></i> ' +
          "</a>" +
          "</td>" +
          "</tr>";
        $("#place-tagihan").append(tabelTagihan);
      }
    }
  });
};

$("body").on("click", ".cekDetailTagihan", function () {
  var $setIndex = $(this);

  var indexDetail = $setIndex.attr("indexTagihan");
  var statusDetail = $setIndex.attr("statusDetail");
  var periodeTagihan = $setIndex.attr("periodeTagihan");

  if (statusDetail === "open") {
    $(".tabelDetailTagihan-" + indexDetail).remove();
    $setIndex.attr("statusDetail", "close");
  } else {
    $.fancybox.helpers.overlay.open();
    $.fancybox.showLoading();

    var urlDetailTagihan =
      service_access +
      "api/detailtagihan/" +
      tokenAccess +
      "/" +
      nosamb_pelanggan +
      "/" +
      periodeTagihan +
      "/" +
      tanggalNow +
      "." +
      waktuNow;

    console.log(urlDetailTagihan);

    $.get(urlDetailTagihan, function (data) {
      $.fancybox.helpers.overlay.close();
      $.fancybox.hideLoading();

      var dataResult = JSON.parse(data);
      console.log(dataResult);

      if (dataResult.mssg == "oke") {
        var tabelDetailTagihan =
          '<tr class="tabelDetailTagihan-' +
          indexDetail +
          '">' +
          '<td colspan="3">' +
          '<div class="table-responsive">' +
          '<table class="table">' +
          "<tbody>" +
          "<tr>" +
          "<td>Stan Bulan Lalu</td>" +
          '<td align="right"><b>' +
          dataResult.data.stanlalu +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Stan Bulan Sekarang</td>" +
          '<td align="right"><b>' +
          dataResult.data.stanskrg +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td><b>Pakai (m3)</b></td>" +
          '<td align="right"><b>' +
          dataResult.data.pakai +
          "m<sup>2</sup></b></td>" +
          "</tr>" +
          "</tbody>" +
          "</table>" +
          '<table class="table table-bordered">' +
          "<thead>" +
          "<tr>" +
          "<td><b>Progresif</b></td>" +
          '<td align="center"><b>Pakai</b></td>' +
          '<td align="center"><b>Biaya</b></td>' +
          '<td align="center"><b>Subtotal</b></td>' +
          "</tr>" +
          "</thead>" +
          "<tbody>" +
          "<tr>" +
          "<td>Blok I</td>" +
          '<td align="center"> ' +
          dataResult.data.pakaiBlk1 +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.tarif1, 2, ",", ".") +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.subtotalBlk1, 2, ",", ".") +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>Blok II</td>" +
          '<td align="center"> ' +
          dataResult.data.pakaiBlk2 +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.tarif2, 2, ",", ".") +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.subtotalBlk2, 2, ",", ".") +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>Blok III</td>" +
          '<td align="center"> ' +
          dataResult.data.pakaiBlk3 +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.tarif3, 2, ",", ".") +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.subtotalBlk3, 2, ",", ".") +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>Blok IV</td>" +
          '<td align="center"> ' +
          dataResult.data.pakaiBlk4 +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.tarif4, 2, ",", ".") +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.subtotalBlk4, 2, ",", ".") +
          "</td>" +
          "</tr>" +
          "<tr>" +
          "<td>Blok V</td>" +
          '<td align="center"> ' +
          dataResult.data.pakaiBlk5 +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.tarif5, 2, ",", ".") +
          "</td>" +
          '<td align="right">	Rp. ' +
          $.number(dataResult.data.subtotalBlk5, 2, ",", ".") +
          "</td>" +
          "</tr>" +
          "</tbody>" +
          "</table>" +
          '<table class="table">' +
          "<tbody>" +
          "<tr>" +
          "<td><b>Perhitungan Rekening</b></td>" +
          '<td align="right"></td>' +
          "</tr>" +
          "<tr>" +
          "<td>Denda Tunggakan</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.dendatunggakan, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Biaya Pemakaian</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.biayapemakaian, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Air Limbah</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.airlimbah, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Administrasi</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.administrasi, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Dana Meter</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.danameter, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Retribusi</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.retribusi, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Pemeliharaan</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.pemeliharaan, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Pelayanan</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.pelayanan, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Materai</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.meterai, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>PPn</td>" +
          '<td align="right"><b>' +
          $.number(dataResult.data.ppn, 2, ",", ".") +
          " %</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td>Persen PPn</td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.persenppn, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "<tr>" +
          "<td><b>TOTAL</b></td>" +
          '<td align="right"><b>Rp. ' +
          $.number(dataResult.data.total, 2, ",", ".") +
          "</b></td>" +
          "</tr>" +
          "</tbody>" +
          "</table>" +
          "</div>" +
          "</td>" +
          "</tr>";

        $setIndex.attr("statusDetail", "open");

        $setIndex.parent().parent().after(tabelDetailTagihan);
      }
    });
  }

  return false;
});
