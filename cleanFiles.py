import os
indir = 'static/Player_Images'
for filenames in os.walk(indir):
    for fname in filenames[2]:
        if ". " in fname:
            os.rename(indir + '/' + fname, indir + '/' + "".join(fname.split(". ")))