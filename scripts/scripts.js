$(document).ready(function () {

    $('.nav a').on('click', function() {
        // Remove active class from all links in nav
        $('.nav a').removeClass('active');
        
        // Add active class to the clicked link
        $(this).addClass('active');
    });

    // Trigger nav burger animation
    $(".main-nav-toggle").click(function (event) {
        event.stopPropagation();
        $(this).toggleClass('active-menu');
        $(".nav").toggleClass('active-menu');
    });

    $(document).click(function () {
        if ($(".main-nav-toggle").hasClass('active-menu')) {
            $(".main-nav-toggle").removeClass('active-menu');
            $(".nav").removeClass('active-menu');
        }
    });

    // Scroll event to remove active class from all links
    $(window).bind('mousewheel', function(event){
        if ($(this).scrollTop() > 0) {
            $('.nav a').removeClass('active');
        }
    });

    // Scroll event to add/remove top class to nav
    $(window).scroll(function() {
        if ($(this).scrollTop() == 0) {
            $('#home').addClass('active')
            $('.nav').removeClass('scrolled');
        } else {
            $('.nav').addClass('scrolled'); 
        }
    });

    var home = document.querySelectorAll('#HomeCarousel');
    var homeinstance = M.Carousel.init(home, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: false,  // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 6000      // Time between transitions in milliseconds
    });

    // // Manually start autoplay after initialization (optional: Dit zou eingelijk niet nodig moeten zijn, maar krijg het anders niet aan de praat)
    // setInterval(function() {
    //     homeinstance[0].next(); // Manually move to the next slide every 2 seconds
    // }, 6000);

    var projectOne = document.querySelectorAll('#ProjectCarouselOne');
    var projectOneinstance = M.Carousel.init(projectOne, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // Get the carousel instance
    var carouselInstanceOne = M.Carousel.getInstance(document.querySelector('#ProjectCarouselOne'));

    // // Previous button action
    document.getElementById('onePrev').addEventListener('click', function() {
        carouselInstanceOne.prev();
    });

    // // Next button action
    document.getElementById('oneNext').addEventListener('click', function() {
        carouselInstanceOne.next();
    });

    var projectTwo = document.querySelectorAll('#ProjectCarouselTwo');
    var projectinstance = M.Carousel.init(projectTwo, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // // Get the carousel instance
    var carouselInstanceTwo = M.Carousel.getInstance(document.querySelector('#ProjectCarouselTwo'));

    // // Previous button action
    document.getElementById('twoPrev').addEventListener('click', function() {
        carouselInstanceTwo.prev();
    });

    // // Next button action
    document.getElementById('twoNext').addEventListener('click', function() {
        carouselInstanceTwo.next();
    });

    var projectThree = document.querySelectorAll('#ProjectCarouselThree');
    var projectinstance = M.Carousel.init(projectThree, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // // Get the carousel instance
    var carouselInstanceThree = M.Carousel.getInstance(document.querySelector('#ProjectCarouselThree'));

    // // Previous button action
    document.getElementById('threePrev').addEventListener('click', function() {
        carouselInstanceThree.prev();
    });

    // // Next button action
    document.getElementById('threeNext').addEventListener('click', function() {
        carouselInstanceThree.next(); 
    });

    var projectFour = document.querySelectorAll('#ProjectCarouselFour');
    var projectinstance = M.Carousel.init(projectFour, {
        fullWidth: true,    // Makes the carousel span the entire width
        indicators: true,   // Show navigation indicators
        autoplay: true,     // Enables automatic transition
        interval: 2000      // Time between transitions in milliseconds
    });

    // // Get the carousel instance
    var carouselInstanceFour = M.Carousel.getInstance(document.querySelector('#ProjectCarouselFour'));

    // // Previous button action
    document.getElementById('fourPrev').addEventListener('click', function() {
        carouselInstanceFour.prev();
    });

    // // Next button action
    document.getElementById('fourNext').addEventListener('click', function() {
        carouselInstanceFour.next();
    });

    var gallery = document.querySelectorAll('#GalleryCarousel');
    var galleryinstance = M.Carousel.init(gallery, {
        fullWidth: true,
        indicators: true
    });

    $('.project .text .btn').click(function() {
        $('.details').removeClass("active");
        $(this).closest(".project").find(".details").addClass("active");
    });

    // Close / hide gallery details
    $('.details .close-icon, .details .bg').on('click', function() {
        $('.details').removeClass('active');
    });

    $('.item').click(function() {
        // Get the title and description from the clicked item
        var title = $(this).find('h3').text();  // Extract title from <h3>
        var description = $(this).find('p').text();  // Extract description from <p>)

        // Show gallery details
        $('.selected').addClass('active');

        // Set the title and description to the target item
        $('.selected').find('h3').text(title);
        $('.selected').find('p').text(description);

        // Clear the current image or video
        $('#Alt').empty();
    
        // Check if there's only a single image or video
        var singleImg = $(this).find('.item-details img');
        var video = $(this).find('.item-details video');
        if (singleImg.length + video.length === 1) {
            $('#Alt').show();
            $('#GalleryCarousel').hide();
            $('.selected .arrow-container').hide();
            if(singleImg.length > video.length){
                $('#Alt').append(singleImg.clone());
            }else{
                $('#Alt').append(video.clone());
            }
            return;
        }

        // Else prepare the carousel
        $('#Alt').hide();
        $('#GalleryCarousel').show();
        $('.selected .arrow-container').show();

        // Get the carousel instance
        galleryinstance = M.Carousel.getInstance(document.querySelector('#GalleryCarousel'));
        galleryinstance.destroy();
        $('#GalleryCarousel').empty();

        $(this).find(".item-details a").each(function(index, image) {
            $('#GalleryCarousel').append($(image).clone());
        });

        galleryinstance = M.Carousel.init(gallery, {
            fullWidth: true,    // Makes the carousel span the entire width
            indicators: true,   // Show navigation indicators
            autoplay: true,     // Enables automatic transition
            interval: 2000      // Time between transitions in milliseconds
        });

        // Get the carousel instance
        var galleryinstance = M.Carousel.getInstance(document.querySelector('#GalleryCarousel'));

        // Previous button action
        document.getElementById('selectedPrev').addEventListener('click', function() {
            galleryinstance.prev();
        });

        // Next button action
        document.getElementById('selectedNext').addEventListener('click', function() {
            galleryinstance.next();
        });
    });

    // Close / hide gallery details
    $('.selected .close-icon, .selected .bg').on('click', function() {
        $('.selected').removeClass('active');
    });
});
