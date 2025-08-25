import { extname } from 'path'
import * as fs from 'fs-extra'

export const generateOriginalFileName = (fileName: string): string => {
  const imageName = String(fileName).split('.')[0]
  const fileExtName = extname(fileName)
  return `${imageName}-${new Date().getTime()}${fileExtName}`
}

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const isExists = await fs.pathExists(path)
    if (isExists) {
      await fs.unlink(path)
    }
  } catch (error) {
    throw error
  }
}
