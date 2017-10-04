const fs = require('fs');

function Buffer(){
	var file_buffered_count = -1;
	var file_streamed_count = -1;
	var buff_count = 0;
	var BUFFER = createNextBuffer();
	var playing = false;

	function createNextBuffer(){
		file_buffered_count++;
		buff_count = 0;
		console.log('buffering',file_buffered_count);
		return fs.createWriteStream('tmp/file_stream'+file_buffered_count+'.mp3');
	}

	this.write = function(data){
		if(buff_count==10){
			BUFFER.end(data);
			BUFFER = createNextBuffer();
		}else{
			BUFFER.write(data);
			buff_count++;
		}
	}
	this.isAvailable = function(){
		return file_buffered_count>0;
	}

	this.getNextFile = function(){
		if(file_streamed_count==-1){
			file_streamed_count = file_buffered_count-1;
		}else{
			file_streamed_count++;
		}
		return 'tmp/file_stream'+(file_streamed_count)+'.mp3';
	}
}