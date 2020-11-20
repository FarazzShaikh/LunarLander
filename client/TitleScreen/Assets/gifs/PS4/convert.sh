for i in *.gif;
  do name=`echo "$i" | cut -d'.' -f1`
  echo "$name"
  ffmpeg -i "$i" "${name}.webm"
  rm -rf "${name}.gif"
done