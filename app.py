from flask import Flask, send_file, jsonify
from flask_restplus import Resource, Api
from flask_cors import CORS
import os
from datetime import datetime
from datetimerange import DateTimeRange
from pydub import AudioSegment
import zipfile
import sys

app = Flask(__name__)
CORS(app)
app.debug = True
app.run(host='0.0.0.0',port='5000')
api = Api(app=app)
ns_files = api.namespace('Brav', description='Filter API')
AudioSegment.converter = "/usr/bin/ffmpeg"

@ns_files.route('/getfiles/<string:folder_name>/<string:start_time>/<string:end_time>')
class brav(Resource):
    def get(self, folder_name,start_time,end_time):
        
        mydict = {}
        sound = None
        low = datetime.strptime(str(start_time).strip(),'%Y%m%d%H%M%S')
        high = datetime.strptime(str(end_time).strip(),'%Y%m%d%H%M%S')
        file_loc = os.path.join(os.getcwd(), "archives/" +folder_name)
        print(file_loc)
        for r, d, files in os.walk(file_loc):
            
            for f in files:
                #sound = AudioSegment.from_mp3(folder_name+'/'+f);
                
                #date_string1 = f.split('_')[1] #comb-mp320200208-114142-20200208-114543.mp3
                fstart_date = f.split('-mp3')[1].split('-')[0] + f.split('-mp3')[1].split('-')[1]
                fend_date = f.split('-mp3')[1].split('-')[2] + f.split('-mp3')[1].split('-')[3].split('.')[0]
                
                

                starttimestamp = datetime.strptime(fstart_date, '%Y%m%d%H%M%S')
                endtimestamp = datetime.strptime(fend_date, '%Y%m%d%H%M%S')
 
                time_dif = self.getfilename(starttimestamp,endtimestamp,low,high)
                print(time_dif)
                #time_info = starttimestamp + " " + endtimestamp + " " + low + " " + high
                
                if sound is not None:
                    if time_dif is not None:
                        if time_dif == 0:
                            sound += AudioSegment.from_mp3(file_loc+'/'+f)
                        elif time_dif == 'trimbetween':
                            st = ((low - starttimestamp).seconds)*1000
                            et = ((high - starttimestamp).seconds)*1000
                            sound += AudioSegment.from_mp3(file_loc+'/'+f)[st:et]
                        elif time_dif == 'trimend':
                            t = ((low-starttimestamp).seconds)*1000
                            sound +=AudioSegment.from_mp3(file_loc+'/'+f)[t:]
                        else:
                            t = time_dif*1000
                            sound +=AudioSegment.from_mp3(file_loc+'/'+f)[:t]
                    
                else:
                    if time_dif is not None:
                        if time_dif == 0:
                            sound = AudioSegment.from_mp3(file_loc+'/'+f)
                        elif time_dif == 'trimbetween':
                            st = ((low - starttimestamp).seconds)*1000
                            et = ((high - starttimestamp).seconds)*1000
                            sound = AudioSegment.from_mp3(file_loc+'/'+f)[st:et]
                        elif time_dif == 'trimend':
                            t = ((low-starttimestamp).seconds)*1000
                            sound =AudioSegment.from_mp3(file_loc+'/'+f)[t:]
                        else:
                            t = time_dif*1000
                            sound =AudioSegment.from_mp3(file_loc+'/'+f)[:t]  
                    

               
                
        if sound is not None:
            return send_file(sound.export("output.mp3",format="mp3"),mimetype="audio/mpeg",attachment_filename="output.mp3")
        else:
            return {"Output":"Time frame out scope"}



        #return {"file":"working"}

    def getfilename(self,starttimestamp,endtimestamp,l,h):
        rng = DateTimeRange(l,h)
        frng = DateTimeRange(starttimestamp,endtimestamp)

        if starttimestamp in rng:
            if endtimestamp in rng:
                return (h-h).seconds
            else:
                return (h-starttimestamp).seconds
        elif endtimestamp in rng:
            return 'trimend'
        elif l in frng:
            return 'trimbetween'
        else:
            return None


@ns_files.route('/getdirectories')
class brav(Resource):
    def get(self):
        
        file_loc = os.path.join(os.getcwd())
        list_subfolders = [f.name for f in os.scandir(file_loc + "/archives/") if f.is_dir() and "turbine" in f.name]
        return {"directories":list_subfolders}




if __name__ == '__main__':
    app.run(debug=True)



