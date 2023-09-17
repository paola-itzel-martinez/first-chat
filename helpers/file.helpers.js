const fs = require("fs")
const { isNil } = require("lodash");
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif']

const GENERAL_DIRECTORY = "../uploads"

const FORBIDEN_EXTENSION_ERROR = {
  code: 401,
  error: `Extension denied, allowed extensions: ${ALLOWED_EXTENSIONS.join(",")}`
}

const uploadFile = ({
    file,
    allowedExtensions = ALLOWED_EXTENSIONS,
    collection = ''
}) => {
    return new Promise((resolve, reject) => {
        try {
            const extension = path.extname(file.name).toLowerCase()

            if (!allowedExtensions.includes(extension)) {
                reject(FORBIDEN_EXTENSION_ERROR)
            }
        
            const newName = uuidv4()
            const newFile = `${newName}${extension}`
            const newPath = path.join(__dirname, '../uploads', collection, newFile)
        
            file.mv(newPath, function(error) {
                if (error) reject({ error, code: 500 })

                const answer = `File uploaded to ${newPath}`
        
                console.info(answer)

                resolve({
                    path: newPath,
                    file: newFile,
                    name: newName,
                    extension
                })
            })
        } catch (error) {
            return reject({ error, code: 500 })
        }
    })
}

const deleteFsFile = ({ path }) => {
    if (isNil(path)) return

    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

const existFsFile = ({ filePath, name }) => {
    const fullPath = path.join(filePath, name)
    let exists = false

    if (isNil(filePath) || isNil(name)) {
        return { exists, fullPath }
    }

    exists = fs.existsSync(fullPath)

    return { exists, fullPath }
}

module.exports = {
    deleteFsFile,
    existFsFile,
    uploadFile
}
