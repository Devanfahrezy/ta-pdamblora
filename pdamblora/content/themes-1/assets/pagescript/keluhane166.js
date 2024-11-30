var Keluhanapp = angular.module("keluhanPage", []);

Keluhanapp.controller("keluhanCtrl", function ($scope, $http) {
  var protocol = location.protocol;
  var slashes = protocol.concat("//");
  var host = slashes.concat(window.location.hostname);
  var urlAccess = host + "/--action/info-tagihan";
  var service_access = "";
  var tanggalNow = moment().format("YYYY-MM-DD");
  var waktuNow = moment().format("H:m:s");
  var tokenAccess = sha1("BSINFO." + tanggalNow + ".PDAM2017." + waktuNow);

  $scope.showListKeluhan = false;
  $scope.showLaporKeluhan = false;
  $scope.showFormKeluhan = false;
  $scope.showNoSambKeluhan = false;
  $scope.cekBalasanKeluhan = true;
  $scope.readOnlyPelanggan = false;
  $scope.laporBerhasil = false;
  $scope.arrayListKeluhan = [];
  $scope.arrayListBalasan = [];
  $scope.formLapor = {};
  $scope.formLapor.selectPrihal = 0;
  $scope.arrayPrihal = [];
  $scope.nomorCekKeluhan = "";
  $scope.backgroundColor = "#33c35f";
  $scope.nomorPengaduan = "";
  $scope.inputNomorSambung = "";
  $scope.indexParams = 0;

  $scope.dataNomorKeluhan = "Kosong";
  $scope.dataNomorPelanggan = "Kosong";
  $scope.dataNamaPelapor = "Kosong";
  $scope.dataAlamatPelapor = "Kosong";
  $scope.dataTelpPelapor = "Kosong";
  $scope.dataKeluhanPrihal = "Kosong";
  $scope.dataKeluhanText = "Kosong";
  $scope.dataTglCreate = "Kosong";
  $scope.dataStatus = "Kosong";
  $scope.dataTglSelesai = "Kosong";
  $scope.isValidPelapor = false;
  $scope.isValidTlpPelapor = false;
  $scope.isValidPerihal = false;
  $scope.isValidAlamat = false;
  $scope.isValidKeluhan = false;

  $scope.openLaporKeluhan = function (string) {
    if (string === "lapor") {
      $scope.showLaporKeluhan = true;
      $scope.showNoSambKeluhan = true;
      $scope.showFormKeluhan = false;
      $scope.cekBalasanKeluhan = false;
      $scope.showListKeluhan = false;
      $scope.readOnlyPelanggan = false;
      $scope.laporBerhasil = false;
      $scope.formLapor = {};
    } else if (string === "form") {
      $scope.showLaporKeluhan = true;
      $scope.showNoSambKeluhan = false;
      $scope.showFormKeluhan = true;
      $scope.cekBalasanKeluhan = false;
      $scope.showListKeluhan = false;
      $scope.readOnlyPelanggan = false;
      $scope.laporBerhasil = false;
      $scope.formLapor = {};
    } else if (string === "cancel") {
      $scope.showLaporKeluhan = false;
      $scope.showNoSambKeluhan = false;
      $scope.showFormKeluhan = false;
      $scope.cekBalasanKeluhan = true;
      $scope.showListKeluhan = false;
      $scope.readOnlyPelanggan = false;
      $scope.laporBerhasil = false;
      $scope.formLapor = {};
    } else if (string === "berhasil") {
      $scope.showLaporKeluhan = false;
      $scope.showNoSambKeluhan = false;
      $scope.showFormKeluhan = false;
      $scope.cekBalasanKeluhan = false;
      $scope.showListKeluhan = false;
      $scope.readOnlyPelanggan = false;
      $scope.laporBerhasil = true;
      $scope.formLapor = {};
    } else if (string === "listkeluhan") {
      $scope.showLaporKeluhan = false;
      $scope.showNoSambKeluhan = false;
      $scope.showFormKeluhan = false;
      $scope.cekBalasanKeluhan = true;
      $scope.showListKeluhan = true;
      $scope.readOnlyPelanggan = false;
      $scope.laporBerhasil = false;
      $scope.formLapor = {};
    }
  };

  $scope.firstLoad = function () {
    $scope.getUrlAkses();
    $scope.loadPrihalKeluhan();
  };

  $scope.getUrlAkses = function () {
    $.fancybox.helpers.overlay.close();
    $.fancybox.hideLoading();

    $http.get(urlAccess).success(function (result) {
      console.log(result);
      service_access = result.url_service + "bsinfo/";
      $.fancybox.helpers.overlay.close();
      $.fancybox.hideLoading();
    });
  };

  $scope.loadForFormLapor = function () {
    $.fancybox.helpers.overlay.open();
    $.fancybox.showLoading();

    var urlPelanggan =
      service_access +
      "api/pelanggan/" +
      tokenAccess +
      "/" +
      $scope.inputNomorSambung +
      "//" +
      tanggalNow +
      "." +
      waktuNow;
    console.log(urlPelanggan);

    $http.get(urlPelanggan).success(function (result) {
      console.log(result);

      $scope.openLaporKeluhan("form");

      $scope.formLapor.nomorSambung = result.data.nosamb;
      $scope.formLapor.NamaPelapor = result.data.nama;
      // $scope.formLapor.AlamatPelapor = result.data.alamat;
      $scope.formLapor.AlamatPelapor = "";
      $scope.formLapor.TelpPelapor = "";
      $scope.formLapor.selectPrihal = "";
      $scope.formLapor.KeluhanPelapor = "";

      $scope.readOnlyPelanggan = true;

      $.fancybox.helpers.overlay.close();
      $.fancybox.hideLoading();
    });
  };

  $scope.kirimLaporan = function () {
    console.log($scope.formLapor);
    if ($scope.formLapor.NamaPelapor == "") {
      $scope.isValidPelapor = true;
      $scope.isValidTlpPelapor = false;
      $scope.isValidPerihal = false;
      $scope.isValidAlamat = false;
      $scope.isValidKeluhan = false;
    } else if ($scope.formLapor.TelpPelapor == "") {
      $scope.isValidTlpPelapor = true;
      $scope.isValidPelapor = false;
      $scope.isValidPerihal = false;
      $scope.isValidAlamat = false;
      $scope.isValidKeluhan = false;
    } else if ($scope.formLapor.selectPrihal == "") {
      $scope.isValidPerihal = true;
      $scope.isValidPelapor = false;
      $scope.isValidTlpPelapor = false;
      $scope.isValidAlamat = false;
      $scope.isValidKeluhan = false;
    } else if ($scope.formLapor.AlamatPelapor == "") {
      $scope.isValidAlamat = true;
      $scope.isValidPelapor = false;
      $scope.isValidTlpPelapor = false;
      $scope.isValidPerihal = false;
      $scope.isValidKeluhan = false;
    } else if ($scope.formLapor.KeluhanPelapor == "") {
      $scope.isValidKeluhan = true;
      $scope.isValidPelapor = false;
      $scope.isValidTlpPelapor = false;
      $scope.isValidPerihal = false;
      $scope.isValidAlamat = false;
    } else {
      $scope.isValidPelapor = false;
      $scope.isValidTlpPelapor = false;
      $scope.isValidPerihal = false;
      $scope.isValidAlamat = false;
      $scope.isValidKeluhan = false;

      $.fancybox.helpers.overlay.open();
      $.fancybox.showLoading();

      var id = $scope.indexParams;
      var urlkirimLaporan = host + "/--action/keluhan/";

      // console.log(dataparam);

      $http.post(urlkirimLaporan, $scope.formLapor).success(function (result) {
        console.log(result);
        if (result.mssg === "oke") {
          // $scope.nomorCekKeluhan = result.data.no_keluhan ;
          $scope.nomorPengaduan = result.data.nopengaduan;
          $scope.nomorCekKeluhan = $scope.formLapor.nomorSambung;
          $scope.openLaporKeluhan("berhasil");
        }

        $.fancybox.helpers.overlay.close();
        $.fancybox.hideLoading();
      });
    }
  };

  $scope.loadPrihalKeluhan = function () {
    var paramsJson = "load?type=prihal";
    var urlLoadPrihal = host + "/--action/keluhan/" + paramsJson;
    console.log(urlLoadPrihal);

    $http.get(urlLoadPrihal).success(function (result) {
      console.log(result);
      $scope.arrayPrihal = result.data;

      // $scope.formLapor.selectPrihal = result.data[0].prihal_sub[0].id_prihal_sub;
      // console.log($scope.formLapor.selectPrihal);

      $.fancybox.helpers.overlay.close();
      $.fancybox.hideLoading();
    });
  };

  $scope.loadListKeluhan = function () {
    $.fancybox.helpers.overlay.open();
    $.fancybox.showLoading();

    var paramsJson = "load?type=list&data=" + $scope.nomorCekKeluhan;
    var urlLoadKeluhan = host + "/--action/keluhan/" + paramsJson;
    console.log(urlLoadKeluhan);

    $http.get(urlLoadKeluhan).success(function (result) {
      console.log(result);
      if (result.mssg == "oke") {
        $scope.arrayListKeluhan = result.data;
        $scope.openLaporKeluhan("listkeluhan");
        $scope.loadDetailKeluhan($scope.arrayListKeluhan[0]);
        $.fancybox.helpers.overlay.close();
        $.fancybox.hideLoading();
      } else {
        alert("Data tidak ditemukan");
        $.fancybox.helpers.overlay.close();
        $.fancybox.hideLoading();
      }
    });
  };

  $scope.loadBalasanKeluhan = function (index) {
    $.fancybox.helpers.overlay.open();
    $.fancybox.showLoading();

    $scope.indexParams = index;

    var idKeluhan = $scope.arrayListKeluhan[index].id_keluhan;
    var paramsJson = "load?type=balasan&data=" + idKeluhan;
    var urlLoadBalasan = host + "/--action/keluhan/" + paramsJson;
    console.log(urlLoadBalasan);

    $http.get(urlLoadBalasan).success(function (result) {
      console.log(result);
      $scope.arrayListBalasan = result.dataReply;
      // $scope.showListBalasan = true ;

      $scope.dataNomorKeluhan = result.dataKeluhan.no_keluhan;
      $scope.dataNomorPelanggan = result.dataKeluhan.no_sambungan;
      $scope.dataNamaPelapor = result.dataKeluhan.nama_pelapor;
      $scope.dataAlamatPelapor = result.dataKeluhan.lokasi_keluhan;
      $scope.dataTelpPelapor = result.dataKeluhan.no_telepon;
      $scope.dataKeluhanPrihal = result.dataKeluhan.keluhan_prihal_sub;
      $scope.dataKeluhanText = result.dataKeluhan.keluhan_text;
      $scope.dataTglCreate = $scope.formatDate(
        result.dataKeluhan.date_create,
        "MMMM Do YYYY, h:mm:ss a"
      );

      // $("#divReplyBalasan").animate({ scrollTop: $('#divReplyBalasan').prop("scrollHeight")}, 500);
      setTimeout(function () {
        var myDiv = $("#divReplyBalasan");
        myDiv.animate(
          { scrollTop: myDiv.prop("scrollHeight") - myDiv.height() },
          1000
        );

        $.fancybox.helpers.overlay.close();
        $.fancybox.hideLoading();
      }, 800);

      // $('#divReplyBalasan').scrollTop($('#divReplyBalasan')[0].scrollHeight);
    });
  };

  $scope.loadDetailKeluhan = function (dataListKeluhan) {
    $scope.dataNomorKeluhan = dataListKeluhan.nomor;
    $scope.dataNomorPelanggan = dataListKeluhan.nosamb;
    $scope.dataNamaPelapor = dataListKeluhan.namapelapor;
    $scope.dataAlamatPelapor = dataListKeluhan.alamatpelapor;
    $scope.dataTelpPelapor = dataListKeluhan.notelppelapor;
    $scope.dataKeluhanPrihal = dataListKeluhan.kategori;
    $scope.dataKeluhanText = dataListKeluhan.uraianlaporan;
    $scope.dataTglCreate = $scope.formatDate(
      dataListKeluhan.tglditerima,
      "MMMM Do YYYY, h:mm:ss a"
    );
    $scope.dataStatus = dataListKeluhan.status;
    if (dataListKeluhan.status === "Pengaduan Diterima") {
      $scope.dataTglSelesai = $scope.formatDate(
        dataListKeluhan.tglditerima,
        "MMMM Do YYYY, h:mm:ss a"
      );
    } else {
      $scope.dataTglSelesai = $scope.formatDate(
        dataListKeluhan.tglselesai,
        "MMMM Do YYYY, h:mm:ss a"
      );
    }

    if (dataListKeluhan.status === "Pengaduan Diterima") {
      $scope.backgroundColor = "#33c35f";
    } else if (dataListKeluhan.status === "Pengaduan Selesai") {
      $scope.backgroundColor = "#1d9bf0";
    } else if (dataListKeluhan.status === "Pengaduan Dikerjakan") {
      $scope.backgroundColor = "#ff8900";
    }
  };

  $scope.formatDate = function (date, format) {
    return moment(date).format(format);
  };

  $scope.kirimBalasan = function () {
    $.fancybox.helpers.overlay.open();
    $.fancybox.showLoading();

    var id = $scope.indexParams;
    var urlkirimBalasan = host + "/--action/keluhan/";

    var dataparam = {
      id_keluhan: $scope.arrayListKeluhan[id].id_keluhan,
      balasan_keluhan: $scope.balasanKeluhan,
    };
    // console.log(dataparam);

    $http.put(urlkirimBalasan, dataparam).success(function (result) {
      console.log(result);
      $scope.balasanKeluhan = "";
      if ($scope.arrayListBalasan.length > 0) {
        $scope.arrayListBalasan.push(result[0]);
      } else {
        $scope.arrayListBalasan = result;
      }

      $.fancybox.helpers.overlay.close();
      $.fancybox.hideLoading();
    });
  };
});
