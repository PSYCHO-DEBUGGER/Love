// ================= VARIABLES =================
var $window = $(window),
    gardenCtx,
    gardenCanvas,
    $garden,
    garden,
    $loveHeart,
    offsetX,
    offsetY,
    startDate = new Date("2024-02-14 00:00:00"); // এখানে তোমার সম্পর্কের শুরুর তারিখ দাও

var clientWidth = $window.width();
var clientHeight = $window.height();

// ================= DOCUMENT READY =================
$(function () {

    // setup heart container
    $loveHeart = $("#loveHeart");
    offsetX = $loveHeart.width() / 2;
    offsetY = $loveHeart.height() / 2 - 55;

    // setup canvas
    $garden = $("#garden");
    gardenCanvas = $garden[0];

    gardenCanvas.width = $loveHeart.width();
    gardenCanvas.height = $loveHeart.height();

    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";

    garden = new Garden(gardenCtx, gardenCanvas);

    // center content
    $("#content").css({
        "width": $loveHeart.width() + $("#code").width(),
        "height": Math.max($loveHeart.height(), $("#code").height()),
        "margin-top": Math.max(($window.height() - $("#content").height()) / 2, 10),
        "margin-left": Math.max(($window.width() - $("#content").width()) / 2, 10)
    });

    // render loop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);

    // start heart animation
    startHeartAnimation();

    // start time counter
    setInterval(update, 1000);
});

// ================= RESIZE FIX =================
$(window).resize(function () {
    location.reload();
});

// ================= HEART POINT =================
function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = -20 * (
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t)
    );
    return [offsetX + x, offsetY + y];
}

// ================= HEART ANIMATION =================
function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = [];

    var animationTimer = setInterval(function () {

        var bloom = getHeartPoint(angle);
        var draw = true;

        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(
                Math.pow(p[0] - bloom[0], 2) +
                Math.pow(p[1] - bloom[1], 2)
            );

            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }

        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);
        }

        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }

    }, interval);
}

// ================= TYPEWRITER =================
(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            var $ele = $(this),
                str = $ele.html(),
                progress = 0;

            $ele.html('');

            var timer = setInterval(function () {
                var current = str.substr(progress, 1);

                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }

                $ele.html(str.substring(0, progress) + (progress % 2 ? '_' : ''));

                if (progress >= str.length) {
                    clearInterval(timer);
                }

            }, 75);
        });
        return this;
    };
})(jQuery);

// ================= LOVE TIMER =================
function update() {

    var current = new Date();
    var totalSeconds = Math.floor((current - startDate) / 1000);

    if (totalSeconds < 0) totalSeconds = 0;

    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var result = "";
    result += "To celebrate our:<br>";
    result += days + " Day ";
    result += "<span class='digit'>" + hours + "</span> Hour ";
    result += "<span class='digit'>" + minutes + "</span> Min ";
    result += "<span class='digit'>" + seconds + "</span> Sec";

    $("#clock").html(result);
}

// ================= MESSAGE =================
function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function () {
        showLoveU();
    });
}

function adjustWordsPosition() {
    $('#words').css({
        "position": "absolute",
        "top": $("#garden").position().top + 195,
        "left": $("#garden").position().left + 70
    });
}

function adjustCodePosition() {
    $('#code').css("margin-top",
        ($("#garden").height() - $("#code").height()) / 2
    );
}

function showLoveU() {
    $('#loveu').fadeIn(3000);
}
