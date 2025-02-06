#!/bin/bash

traverse_directory() {
	local directory=$1
	for item in "$directory"/*
	do
		# if [ -f "$item" ]; then
		# #echo "$item 是文件"
		# return
		if [ -d "$item" ]; then
			#echo "$item 是文件夹"
			echo "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><title>caofangkuai-studio Repository</title><style>body{background:#fff}</style></head><body><header><h1>caofangkuai-studio Repository</h1></header><hr/><main><pre><a href=\"../repository-subfile.html\">../</a><br>" > "$item/repository-subfile.html"
			#find "$item" -mindepth 1 -printf '文件列表: %p\n' >> "$item/repository-subfile.html"
			for file in `ls $item`
			do
				if [ -f "$item/$file" ]; then
					#文件
					if [ "$file" != "repository-subfile.html" ]; then
						echo "<a href=\"$(basename $file)\">$file</a><br>" >> "$item/repository-subfile.html"
					fi
				elif [ -d "$item/$file" ]; then
					#文件夹
					echo "<a href=\"$(basename $file)/repository-subfile.html\">$file</a><br>" >> "$item/repository-subfile.html"
				fi
			done
			echo "</pre></main><hr/></body></html>" >> "$item/repository-subfile.html"
			traverse_directory "$item"
		fi
	done
}

#开始
target_directory="/storage/emulated/0/12530/caofangkuai-studioRepo"
#检测文件夹
if [ -f "$target_directory" ];then
    echo "删除旧的文件夹"
	rm -r "$target_directory"
fi
if [ ! -d "$target_directory" ];then
	mkdir "$target_directory"
fi
echo "文件夹准备完成!"
# 调用遍历函数
echo "开始复制文件"
#cp -a /storage/emulated/0/AideProjects/* "$target_directory"
#cp -a /storage/emulated/0/WebCat/project/* "$target_directory"
#cp -a /storage/emulated/0/S5droid/projects/* "$target_directory"
cp -a /storage/emulated/0/12530/源码/* "$target_directory"
echo "复制完成，开始生成html"
#生成根目录index.html
echo "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><title>caofangkuai-studio Repository</title><style>body{background:#fff}</style></head><body><header><h1>caofangkuai-studio Repository</h1></header><hr/><main><pre>" > "$target_directory/index.html"
for file2 in `ls $target_directory`
do
	if [ -f "$target_directory/$file2" ]; then
		#文件
		if [ "$file2" != "index.html" ] && [ "$file2" != "repository-subfile.html" ]; then
			echo "<a href=\"$(basename $file2)\">$file2</a><br>" >> "$target_directory/index.html"
		fi
	elif [ -d "$target_directory/$file2" ]; then
		#文件夹
		echo "<a href=\"$(basename $file2)/repository-subfile.html\">$file2</a><br>" >> "$target_directory/index.html"
	fi
done
echo "</pre></main><hr/></body></html>" >> "$target_directory/index.html"
#生成根目录repository-subfile.html(立即跳转到index.html)
echo "<html><meta http-equiv=\"refresh\" content=\"0;url=index.html\"></html>" > "$target_directory/repository-subfile.html"
#生成其他
traverse_directory "$target_directory"
echo "html生成完成"
