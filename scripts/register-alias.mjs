import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register('./tsconfig-alias-hook.mjs', pathToFileURL(import.meta.filename))
