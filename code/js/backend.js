// Variables to keep track of current card and top card in stack
var index=1;
var selector=1;

// Run our jQuery javascript once the page is ready
$(document).ready( function() {
    // Data is obtained from the cgi script and rendered on the first card behind intro card
    $.getJSON('./get_random_sql.cgi', function(data) {
      //console.log(data); //Debug
        $.each( data, function( key, val ) {
          $('.current-card').append('<li>'+key+': '+val+'</li>');
        });
        $('.current-card').append('<li><a href=\'http://flybase.org/reports/'+data['FlyBase ID']+'\'> HyperLink to FlyBase Report. </a></li>');
    });

    // Data is obtained from the cgi script and rendered on the first card
    // Intro button similar to next button but deleted after intro card
    $('#intro-button').click( function() {
        $("#intro-card").animate({marginLeft: "+=150px",rotate: "40deg"}).fadeOut(300);
        $("#intro-button").css("visibility", "hidden").remove();
        $("#next-button").css("visibility", "visible");
        $(".current-card").fadeIn(1000);
        $("#odorbase_search").fadeIn(1000);
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
            $("#card"+index).append('<li>'+key+': '+val+'</li>');
          });
          $("#card"+index).append('<li><a href=\'http://flybase.org/reports/'+data['FlyBase ID']+'\'> HyperLink to FlyBase Report. </a></li>');
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

    // Search functionality: one card per result is/are added to the end of the stack
    $('#submit').click( function() {
      // transforms all the form parameters into a string we can send to the server
      var frmStr = $('#odorbase_search').serialize();

      $.ajax({
          url: './get_sql.cgi',
          dataType: 'json',
          data: frmStr,
          success: function(data, textStatus, jqXHR) {
            alert(data.match_count + " matches were found and " + data.match_count + " cards added to the bottom of the stack.");
            $.each( data.matches, function( i, item ) {
              index++;
              $('.cardcontainer').append("<ul class=\"card\" id=\"card"+index+"\">");
              $("#card"+index).append('<li>'+'FlyBase ID: '+item.FlyBaseID+'</li>');
              $("#card"+index).append('<li>'+'Feature Type: '+item.Feature_Type+'</li>');
              $("#card"+index).append('<li>'+'Name: '+item.Name+'</li>');
              $("#card"+index).append('<li>'+'Symbol: '+item.Symbol+'</li>');
              $("#card"+index).append('<li>'+'UniProt Function: '+item.UniProt_Function+'</li>');
              $("#card"+index).append('<li>'+'Protein Family: '+item.Protein_Family+'</li>');
              $("#card"+index).append('<li><a href=\'http://flybase.org/reports/'+data['FlyBase ID']+'\'> HyperLink to FlyBase Report. </a></li>');
            });
          },
          error: function(jqXHR, textStatus, errorThrown){
              alert("Failed to perform search! textStatus: (" + textStatus +
                    ") and errorThrown: (" + errorThrown + ")");
          }
      });
      console.log(selector,index);
      return false;  // prevents 'normal' form submission
    });
});
