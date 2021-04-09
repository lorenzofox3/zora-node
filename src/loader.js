import {createRequire} from 'module';
import {resolve} from 'path';
import {pathToFileURL} from 'url';

export default async ({loader = 'ES', path}) => {
    if (loader === 'cjs') {
        return loadCJS(path);
    }
    
    return loadES(path);
    
    async function loadES(path) {
        const module = await import(pathToFileURL(resolve(process.cwd(), path)));
        return module.default;
    }
    
    async function loadCJS(path) {
        const fullPath = resolve(process.cwd(), path);
        const require = createRequire(fullPath);
        return require(fullPath).default;
    }
};
