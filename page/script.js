$(document).ready(function() {  
    $('.divicionValoracion').each(function() {
        var video = this;

        // creamos el objeto JSON que enviaremos a la página PHP
        var datos = {
            video_id : $(video).attr('id'), // este es el id que mencionamos antes  
            buscar: 1 // indicamos que queremos obtener la información y no guardar un voto
        };

        // cargamos datos del servidor utilizando un pedido HTTP POST
        $.post(
            'votosvideos.php', // archivo que va a recibir nuestro pedido                    
            datos, // el objeto que creamos antes

            // función que se ejecutará cuando obtengamos la respuesta
            function(INFO) { // INFO son los datos que nos devuelve la página PHP

                // data es un método jQuery que nos permite asociar datos a un objeto del DOM
                $(video).data( 'puntaje', INFO );

                // llamamos al método que carga los valores en las estrellas y la información
                indicarVotos(video);
            },
            'json'
        );
    });

    // cuando pasamos el mouse por encima de las estrellas
    $('.estrellasValoracion').hover(

        // la función hover necesita que definamos dos funciones
        // una para cuando el puntero del mouse se posiciona sobre el elemento
        function() {

            // dependiendo el div en el que nos encontremos,
            // a todos los divs anteriores y al que tiene el mouse encima, les agregamos esta clase
            $(this).prevAll().andSelf().addClass('estrellaVotar');

            // a los siguientes le quitamos esta clase
            $(this).nextAll().removeClass('estrellaValoracion'); 
        },
        
        // y una para cuando el mouse deja el elemento
        function() {

            // a todos los divs anteriores y al que tenía el mouse encima, les quitamos esta clase
            $(this).prevAll().andSelf().removeClass('estrellaVotar');
            
            // llamamos al método que carga los valores originales de las estrellas
            indicarVotos($(this).parent());
        }
    );

    // este método es el que guarda el voto, al hacer click sobre una estrella
    $('.estrellasValoracion').bind('click', function() {

        // obtenemos la estrella sobre la que se hizo click
        var estrella = this;

        // obtenemos la película a la que pertenece la estrella
        var video = $(this).parent();
        
        // creamos el objeto para enviar a la página PHP
        var datosClick = {
            clickEstrella : $(estrella).attr('class'),
            video_id : $(estrella).parent().attr('id')
        };

        // cargamos datos del servidor utilizando un pedido HTTP POST
        $.post(
            'votosvideos.php', // archivo que recibe nuestro pedido
            datosClick, // datos que le enviamos a la página

            // función que se ejecuta cuando obtenemos la respuesta
            function(INFO) { // INFO son los datos que nos devolvió la página PHP

                // data nos permite asociar datos a un objeto del DOM
                video.data( 'puntaje', INFO );

                // llamaos al método que llena los valores
                indicarVotos(video);
            },
            'json'
        ); 
    });
});

// función encargada de tomar los datos que se obtuvieron de la página PHP
// y cargar las estrellas correspondientes
function indicarVotos(video) {

    // extraemos la información guardada el objeto DOM donde está la película
    // y creamos 3 variables para mostrar los datos
    var promedioRedondeado = $(video).data('puntaje').promedioRedondeado;
    var votos = $(video).data('puntaje').numeroDeVotos;
    var promedioExacto = $(video).data('puntaje').promedioExacto;            

    // buscamos la estrella de la película que tenga el número igual al promedio redondeado
    // de esa para atrás, les cargamos la clase estrellaValoración
    $(video).find('.estrella_' + promedioRedondeado).prevAll().andSelf().addClass('estrellaValoracion');

    // a las que la suceden (si las hubiera) le quitamos la clase (por si la tenían) para que queden vacías
    $(video).find('.estrella_' + promedioRedondeado).nextAll().removeClass('estrellaValoracion'); 

    // mostramos la cantidad de votos y el promedio exacto
    $(video).find('.votosTotales').text( votos + ' votos (' + promedioExacto + ')' );
}
