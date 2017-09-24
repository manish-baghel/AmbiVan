jQuery(document).ready(function () {


    $('#carouselHacked').carousel();

    //this code is for smooth scroll and nav selector
    $(document).ready(function () {
        $(document).on("scroll", onScroll);

        //smoothscroll
        $('a[href^="#"]').on('click', function (e) {
            e.preventDefault();
            $(document).off("scroll");

            $('a').each(function () {
                $(this).removeClass('active');
            })
            $(this).addClass('active');

            var target = this.hash,
                menu = target;
            $target = $(target);
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top + 2
            }, 500, 'swing', function () {
                window.location.hash = target;
                $(document).on("scroll", onScroll);
            });
        });
    });

    $(".ambuSearch-button").click(function () {
       window.location.href = "/ambulance/getAmbulance";
    });
    
    function onScroll(event) {
        var scrollPos = $(document).scrollTop();
        $('.navbar-default .navbar-nav>li>a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.navbar-default .navbar-nav>li>a').removeClass("active");
                currLink.addClass("active");
            } else {
                currLink.removeClass("active");
            }
        });
    }


    //this code is for animation nav
    jQuery(window).scroll(function () {
        var windowScrollPosTop = jQuery(window).scrollTop();

        if (windowScrollPosTop >= 150) {
            jQuery(".header").css({
                "background": "#B193DD",
            });
            jQuery(".top-header .logo").css({
                "margin-top": "-30px",
                "margin-bottom": "0"
            });
            jQuery(".navbar-default").css({
                "margin-top": "-10px",
            });
        } else {
            jQuery(".header").css({
                "background": "transparent",
            });
            jQuery(".top-header .logo").css({
                "margin-top": "-15px",
                "margin-bottom": "0px"
            });
            jQuery(".navbar-default").css({
                "margin-top": "7px",
                "margin-bottom": "0"
            });

        }
    });
    
});
