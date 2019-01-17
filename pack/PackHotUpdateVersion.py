#!/usr/bin/python
#encoding=utf-8

import json;
from hashlib import md5;
import os;
import shutil
import zipfile
import sys;

'''
pack = PackHotUpdateVersion();
pack.autoPack();#从version.manifest groupVersions中最后一个版本号+1生成一个版本,进行打包操作
#pack.packByVersion("1.0.1") # 打指定的版本,必须存在于version.manifest groupVersions中
'''

MANIFEST_DIR = "./"
PROJECT_MANIFEST_PATH = MANIFEST_DIR + "project.manifest"
VERSION_MANIFEST_PATH = MANIFEST_DIR + "version.manifest"
#记录文件的MD5
FILES_MD5_PATH = "./md5list.json"
#分支目录
TAGS_PATH = "../tags/"
ZIP_OUT_FILENAME= "{0}.zip"
#输出目录
OUTPUT_DIR = "./update/"


DEFAULT_VERSION = "1.0.0"
DEFAULT_GROUPID = 0

CONFIG = {
    "UPDATE_SVN":False #是否更新SVN
}

#需要热更的目录
NEED_UPDATE_DIR = {
    "src":True,
    "script":True,
    "res":True
}

def log(info):
    print(info)

class PackHotUpdateVersion:
    def __init__(self):
        pass;

    def autoPack(self):
        log("start autoPack...........")
        self._init()
        groupVersions = self.versionManifest["groupVersions"]

        lastGroupId = DEFAULT_GROUPID;
        lastVersion = DEFAULT_VERSION;

        if groupVersions:
            keys = list(groupVersions.keys())
            lastGroupId = keys[len(keys) - 1]
            lastVersion = groupVersions.get(lastGroupId)

        newGroupId = int(lastGroupId) + 1
        newVersion = self.getNewVersion(lastVersion);

        self.packVersion(newGroupId, newVersion);
        log("end autoPack...........")

    def packByVersion(self, version):
        log("start packByVersion............." + version)
        self._init()
        groupId = self.getGroupIdByVersion(version)
        if (groupId == -1):
            raise RuntimeError('pack version failed: cant find group id by version {0}'.format(version));
        self.packVersion(groupId, version);
        log("end packByVersion............." + version)

    def _init(self):
        try:
            tmp = self.versionManifest
        except Exception:
            self.updateSvn(MANIFEST_DIR)
            self.versionManifest = self.readJson(VERSION_MANIFEST_PATH);
            self.projectManifest = self.readJson(PROJECT_MANIFEST_PATH);
            self.dicFilesMd5 = self.readJson(FILES_MD5_PATH)
            groupVersions = self.versionManifest["groupVersions"]
            version = DEFAULT_VERSION
            if (groupVersions):
                keys = list(groupVersions.keys())
                version = groupVersions.get(keys[0])
                # raise RuntimeError('groupVersions at least one value');
            if (not self.dicFilesMd5):  # 初始化基础版本的MD5
                self.generateAndUpdateFilesMd5(version)
                # self.wirteJson(FILES_MD5_PATH, self.dicFilesMd5);

    # 打包
    def packVersion(self, groupId, version):
        str = input("是否开始打{0}版本(y/n):".format(version))
        str = str.lower().strip()
        if str == "y":
            self._packVersion0(groupId, version)
            return True;
        return False;

    def getTempPath(self):
        return TAGS_PATH + "temp/"

    def _packVersion0(self, groupId, version):
        log("start packVersion................" + version)
        versionPath = self.getVersionPath(version)
        if (not os.path.exists(versionPath)):
            raise RuntimeError('No version of {0} was found'.format(versionPath));

        tmpPath = self.getTempPath();
        self.updateSvn(versionPath)

        md5FilesChanged = False;

        dirs = os.listdir(versionPath)
        for dir in dirs:
            if NEED_UPDATE_DIR.get(dir):

                if os.path.exists(tmpPath):
                    shutil.rmtree(tmpPath)
                os.makedirs(tmpPath)

                subPath = versionPath + dir
                files = self._packVersion1(subPath, version, tmpPath)
                if len(files) > 0:
                    zipDir = OUTPUT_DIR;
                    if not (os.path.exists(zipDir)):
                        os.makedirs(zipDir)

                    fstr = "".join(version.split("."))
                    fileName = ZIP_OUT_FILENAME.format(dir + "_" + fstr);
                    zipPath = zipDir + fileName;
                    log("begin zip files--->" + fileName)
                    # self.preZipDir(tmpPath,dir)
                    self.zipDir(tmpPath, zipPath)
                    assets = self.projectManifest.get("assets")
                    assets[dir + fstr] = {"path": fileName, "md5": self.md5File(zipPath),
                                                       "compressed": True, "group": str(groupId)};
                    md5FilesChanged = True;


        if (md5FilesChanged):  # 如果有改变就
            zipDir = OUTPUT_DIR;
            if not (os.path.exists(zipDir)):
                os.makedirs(zipDir)
            # 注意，manifest中的version必须和APK包中的version一致，否则会出现旧热更包覆盖新热更包的现象(旧包后下载完)
            self.versionManifest["version"] = version
            self.projectManifest["version"] = version
            self.versionManifest["groupVersions"][str(groupId)] = version
            self.projectManifest["groupVersions"][str(groupId)] = version

            self.wirteJson(VERSION_MANIFEST_PATH, self.versionManifest);
            self.wirteJson(PROJECT_MANIFEST_PATH, self.projectManifest);
            self.wirteJson(FILES_MD5_PATH, self.dicFilesMd5);
        log("end packVersion................" + version)

    def _packVersion1(self, rootdir, version, destRootDir):
        _files = []
        list = os.listdir(rootdir)  # 列出文件夹下所有的目录与文件
        for i in range(0, len(list)):
            path = os.path.join(rootdir, list[i])
            if os.path.isdir(path):
                _files.extend(self._packVersion1(path, version, destRootDir))
            if os.path.isfile(path):
                md5Str = self.md5File(path)
                md5Key = self.getMd5Key(path, version)
                if (self.dicFilesMd5.get(md5Key) != md5Str):
                    self.dicFilesMd5[md5Key] = md5Str
                    _files.append(path)
                    self.copyFile(path, md5Key, destRootDir)

        return _files

    def readJson(self,path):
        log("start readJson:" + path);
        with open(path, 'r') as f:
            temp = json.loads(f.read())
            return temp

    def wirteJson(self,path,dict):
        log("start wirteJson:" + path);
        jsonStr = json.dumps(dict, indent=4)
        with open(path, 'w') as json_file:
            json_file.write(jsonStr)
        log("end wirteJson:" + path);

    def updateSvn(self,dir):
        if CONFIG["UPDATE_SVN"] == False:
            return;
        log("start update svn---->" + dir)
        curdir = os.getcwd()
        os.chdir(dir)
        os.system("svn up")
        os.chdir(curdir)
        log("finished update svn-----")

    def md5File(self,path):
        m = md5()
        a_file = open(path, 'rb')
        m.update(a_file.read())
        a_file.close()
        return m.hexdigest()

    def generateAndUpdateFilesMd5(self,version):
        log("start generateAndUpdateFilesMd5..............")
        path = TAGS_PATH + version
        if (os.path.exists(path) and os.path.isdir(path)):
            dirs = os.listdir(path)
            for dir in dirs:
                if NEED_UPDATE_DIR.get(dir):
                    subPath = path + "/" + dir
                    self._generateAndUpdateFilesMd5(subPath,version)
        log("end generateAndUpdateFilesMd5..............")

    def _generateAndUpdateFilesMd5(self,rootdir,version):
        # _files = []
        list = os.listdir(rootdir)  # 列出文件夹下所有的目录与文件
        for i in range(0, len(list)):
            path = os.path.join(rootdir, list[i])
            if os.path.isdir(path):
                # _files.extend(self._generateAndUpdateFilesMd5(path,version))
                self._generateAndUpdateFilesMd5(path, version)
            if os.path.isfile(path):
                md5Str = self.md5File(path)
                md5Key = self.getMd5Key(path,version)
                if (self.dicFilesMd5.get(md5Key) != md5Str):
                    self.dicFilesMd5[md5Key] = md5Str

                # _files.append(path)
        # return _files

    def getMd5Key(self,path,version):
        path = path.replace(TAGS_PATH, "")
        path = path.replace(version, "")
        path = path.replace("\\", "/")
        if (path.startswith("/")):
            path = path[1:]
        return path

    def getNewVersion(self,version):
        arr = version.split(".")
        lastIndex = len(arr) - 1
        arr[lastIndex] = str(int(arr[lastIndex]) + 1)
        ver = ".".join(arr)
        return ver

    def getVersionPath(self,version):
        path = TAGS_PATH + version + "/"
        return path

    #注意源码是以src子目录开始的
    def preZipDir(self,dirpath,dir):
        curdir = os.getcwd()

        subpath = dirpath + dir
        if os.path.exists(subpath):
            self.copyFiles(subpath,dirpath)
            shutil.rmtree(subpath)

        # subpath = dirpath + "res"
        # if os.path.exists(subpath):
        #     self.copyFiles(subpath,dirpath)
        #     shutil.rmtree(subpath)

        # subpath = dirpath + "script"
        # if

        os.chdir(curdir)

    def zipDir(self,dirpath, outFullName):
        zip = zipfile.ZipFile(outFullName, "w", zipfile.ZIP_DEFLATED)
        for path, dirnames, filenames in os.walk(dirpath):
            # 去掉目标跟路径，只对目标文件夹下边的文件及文件夹进行压缩
            fpath = path.replace(dirpath, '')

            for filename in filenames:
                zip.write(os.path.join(path, filename), os.path.join(fpath, filename))
        zip.close()

    def copyFile(self,path,relatPath,destRootDir):
        log("start copyFile.........\nfrom:")
        log(path)
        destPath = destRootDir + "/" + relatPath
        log("to.........." + destPath)
        destDir = os.path.split(destPath)[0]

        if (not os.path.exists(destDir)):
            os.makedirs(destDir)

        shutil.copyfile(path,destPath)
        log("end copyFile.........")

    def copyFiles(self,srcDir, destDir):
        for files in os.listdir(srcDir):
            name = os.path.join(srcDir, files)
            back_name = os.path.join(destDir, files)
            if os.path.isfile(name):
                shutil.copy(name, back_name)
            else:
                if not os.path.isdir(back_name):
                    os.makedirs(back_name)
                self.copyFiles(name, back_name)


    def getGroupIdByVersion(self,version):
        groupVersions = self.versionManifest["groupVersions"]
        keys = list(groupVersions.keys())
        for i in keys:
            if (version == groupVersions.get(i)):
                return i;
        return -1;

    def clearTempRes(self):
        tmpPath = self.getTempPath()
        if os.path.exists(tmpPath):
            shutil.rmtree(tmpPath)


if __name__ == '__main__':
    pack = PackHotUpdateVersion();

    # if True:
        # pack.preZipDir("../tags/temp/")


    if True:
        if len(sys.argv) > 1:
            if sys.argv[1] == "version":
                str = input("请输入要打的版本号(格式:1.0.xxx):")
                pack.packByVersion(str);
        else:
            pack.autoPack();
    else:
        # pack.packByVersion("1.0.0")
        pass;
    pack.clearTempRes();
    log("FINISHED.....")