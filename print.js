

/*
 *Request id function
 */
var id=1;
function getId(){
    if(id>10){
        id=1;
    }
    return id++;
}

/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 * 
 *   http://code.google.com/p/phantomjs/issues/detail?id=132
 * 
 * This is from comment #43.
 */
function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
}


/*
 *Server
 */
var server, service, fs;
server = require('webserver').create();
fs = require('fs');

service = server.listen(9696, function (request, response) {
    console.log(JSON.stringify(request.post));
    var filename = getId()+'.'+request.post.file;
    var page = require('webpage').create();

    page.viewportSize = {
        width: 500, 
        height: 350
    };
    page.clipRect = {
        top: 0, 
        left: 0, 
        width: 500, 
        height: 400
    } 
    page.open("index.html", function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            window.setTimeout(function () {
                /*page.evaluate(function () {
                    $("#form").remove();
                });*/
                evaluate(page, function (post) {
                    $("#form").remove();
                    $("#vTitle").html(post.title);
                    $("#vContent").html(post.content);
                    $('#view').css('background-image','url("photo/'+post.picture+'.jpg")');
                },request.post);
                page.render(filename);
            }, 200);
        }
    });
    response.statusCode = 200;
    response.write(filename);
    response.close();
});


    
//phantom.exit();
//});
