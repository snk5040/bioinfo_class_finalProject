// Variables to keep track of current card and top card in stack
var index=1;
var selector=1;

// Run our jQuery javascript once the page is ready
$(document).ready( function() {
    // Data is obtained from the cgi script and rendered on the first card behind intro card
    $.getJSON('./get_random_sql.cgi', function(data) {
      //console.log(data); //Debug
        $.each( data, function( key, val ) {
          $('.current-card').append('<li>'+val+'</li>');
        });
    });

    // Data is obtained from the cgi script and rendered on the first card
    // Intro button similar to next button but deleted after intro card
    $('#intro-button').click( function() {
        $("#intro-card").animate({marginLeft: "+=150px",rotate: "40deg"}).fadeOut(300);
        $("#intro-button").css("visibility", "hidden").remove();
        $("#next-button").css("visibility", "visible");
        $(".current-card").fadeIn(1000);
        console.log(selector,index);
    });

    // Next button functionality, fade out current card while fading in next card
    // If no next card exists it will be generated from cgi script
    $('#next-button').click( function() {
      $("#intro-card").remove();
      if($(".current-card").is("#card"+index)){
        index++;
        $('.cardcontainer').append("<ul class=\"card\" id=\"card"+index+"\">");
        $.getJSON('./get_random_sql.cgi', function(data) {
          //console.log(data); //DEBUG
          $.each( data, function( key, val ) {
            $("#card"+index).append('<li>'+val+'</li>');
          });
        });
        $(".current-card").animate({marginLeft: "+=150px",rotate: "40deg"}).fadeOut(300).attr("class","card");
        $("#card"+index).fadeIn(1000).attr("class","current-card");
        selector++;
      }else{
        selector++;
        $(".current-card").animate({marginLeft: "+=150px",rotate: "40deg"}).fadeOut(300).attr("class","card");
        $("#card"+selector).fadeIn(1000).attr("class","current-card");
      }
      console.log(selector,index);
    });

    // Previous button functionality, fade out current card while fading in previous card
    // Update variables to keep track of the stack, block if at bottom of stack
    $('#previous-button').click( function() {
      if ( $(".intro-card").is("#intro-card")||selector<=1) {
          alert("Can't go back");
      }else{
        selector--;
        $("#card"+selector).fadeIn(300).animate({marginLeft: "-=150px",rotate: "0deg"});
        $(".current-card").fadeOut(1000);
        $(".current-card").attr("class","card");
        $("#card"+selector).attr("class","current-card");
      }
      console.log(selector,index);
    });
});
