var info = {
  host: "localhost",
  port: 3033,
  dashboardId: new Date().getTime() + "-" + Math.floor(Math.random() * 99999),
};

var remoteViewer = io.connect("http://" + info.host + ":" + info.port);

function getScreenshot() {
  var data = {
    from: $(".terminalId").val(),
    to: "dashboard-" + info.dashboardId,
    screen: $(".select").val(),
    dimension: $(".screen").val(), // Max width: 1280, max height: 720
  };
  console.log({ getScreenshot: data });
  remoteViewer.emit("screenshotRequest", data);
}

remoteViewer.on("connect", function () {
  console.log(remoteViewer.id);
  remoteViewer.emit("joinToRoom", { roomName: "dashboard-" + info.dashboardId });
});

remoteViewer.on("disconnect", function () {
  console.log("Disconnected !");
});

remoteViewer.on("screenshotResponse", function (data) {
  console.log({ screenshotResponse: data });
  !!data.src ? console.log('+') : console.log('-');

  if (data.src.length > 0) {
    $(".listOfScreensAndWindows").html(
      '<div class="col-12 col-sm-12 col-md-12 m-0 p-0"><img class="w-100 h-100 p-0 m-0" src=' +
      data.src +
      "></div>"
    );
  }
  //getScreenshot();
});


$(document).ready(function () {
  if (localStorage.getItem("terminalId")) {
    $(".terminalId").val(localStorage.getItem("terminalId"));
  }
});

$(document).on("change", ".terminalId", function () {
  localStorage.setItem("terminalId", $(this).val());
});

$(document).on("click", ".screenshotBtn", function () {
  getScreenshot();
});


$(document).on("click", ".listOfScreensAndWindows", function () {
  var data = {
    from: $(".terminalId").val(),
    to: "dashboard-" + info.dashboardId,
  };
  remoteViewer.emit("click", data);
});

remoteViewer.on("getRunResponse", function (data) {
  console.log({ getRunResponse: data });
  $(".cmdArea").text(data.cmd);
});

function getRun() {
  console.log('getRunFunc');
  var data = {
    from: $(".terminalId").val(),
    to: "dashboard-" + info.dashboardId,
    cmd: $(".cmd").val(),
  };
  remoteViewer.emit("getRunRequest", data);
}

$(document).on("click", ".runBtn", function () {
  getRun();
});
