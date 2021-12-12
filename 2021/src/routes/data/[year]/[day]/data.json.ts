// import { isImage, rootDir } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import * as path from 'path';

// const imageFile = (dirent) => dirent.isFile() && isImage(dirent.name);

export const get: RequestHandler = async ({ params }) => {
	const { year, day } = params;
	console.log('PARAMS', params);

	const staticDir = 'static';
	const fileNamePrefix = `${year}-${day}-`;
	const testData = path.join(staticDir, 'data', fileNamePrefix + 'testdata.txt');
	const inputData = path.join(staticDir, 'data', fileNamePrefix + 'input.txt');

	const [test, input] = await Promise.all([fs.readFile(testData), fs.readFile(inputData)]);

	return {
		body: {
			test: test.toString(),
			input: input.toString()
		}
	};
};
