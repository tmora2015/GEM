<?php

// se crea un nuevo objeto y le pasamos el id de la pel�cula que vino por el postback
$votosvideos = new votovideo($_POST['video_id']);

// si en el postback se indic� la variable buscar, obtenemos los votoss, sino guardamos el voto
isset($_POST['buscar']) ? $votosvideos->obtenerVotos() : $votosvideos->votar();

// definici�n de la clase
class votovideo {

	// el archivo donde guardamos los datos
	var $data_file = './basededatos.txt';
	private $video_id;
	private $data = array();

	// el constructor de la clase va a recibir la pel�cula
	function __construct($videos) {

		// guardamos la pel�cula en la propiedad
		$this->video_id = $videos;

		// file_get_contents devuelve lo que est� en el archivo de texto a una variable string
		$info = file_get_contents($this->data_file);

		// si se carg� el archivo
		if($info) {

			// transformamos los datos planos a un array en php
			$this->data = unserialize($info);
		}
	}


	public function obtenerVotos() {

		// si en el arreglo con los datos del archivo txt (que se carg� en el constructor), est� el id de la pel�cula
		if($this->data[$this->video_id]) {

			// devolvemos los datos de la pel�cula por JSON a la pag�na
			echo json_encode($this->data[$this->video_id]);
		}
		else { // caso contrario

			// cargamos los datos de la pel�cula al arreglo, con los valores por defecto
			$data['video_id'] = $this->video_id;
			$data['numeroDeVotos'] = 0;
			$data['votosTotales'] = 0;
			$data['promedioExacto'] = 0;
			$data['promedioRedondeado'] = 0;

			// devolvemos el objeto reci�n creado por JSON a la p�gina
			echo json_encode($data);
		}
	}

	public function votar() {

		// necesitamos saber qu� estrella es la que se vot�
		// para eso, usamos preg_match, que realiza una comparaci�n
		// tomando la expresi�n regular, la cadena de entrada (la estrella en la que hizo click) y dejando el resultado en $resultado
		preg_match('/estrella_([1-5]{1})/', $_POST['clickEstrella'], $resultado);

		// guardamos el valor de la estrella
		$votar = $resultado[1];

		$ID = $this->video_id;

		// si existe la pel�cula en el arreglo (cargado en el constructor)
		if($this->data[$ID]) {

			// aumentamos el n�mero de votos en 1
			$this->data[$ID]['numeroDeVotos'] += 1;

			// sumamos el voto a los votos totales
			$this->data[$ID]['votosTotales'] += $votar;
		}
		else { // si no existe la pel�cula

			// indicamos que es el primer voto
			$this->data[$ID]['numeroDeVotos'] = 1;

			// indicamos el n�mero del primer voto
			$this->data[$ID]['votosTotales'] = $votar;
		}

		// calculamos el promedioExacto
		$this->data[$ID]['promedioExacto'] =
		round( $this->data[$ID]['votosTotales'] / $this->data[$ID]['numeroDeVotos'], 1 );

		// redondeamos el promedio, para no tener que volver a hacerlo en la p�gina
		$this->data[$ID]['promedioRedondeado'] = round( $this->data[$ID]['promedioExacto'] );

		// guardamos el arreglo en formato plano de nuevo en el archivo de texto
		file_put_contents($this->data_file, serialize($this->data));

		// obtenemos el nuevo votos para envi�rselo a la p�gina
		$this->obtenerVotos();
	}
}
?>



