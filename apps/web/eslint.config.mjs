import pluginQuery from '@tanstack/eslint-plugin-query';

/**
 * @todo Tanstack QueryがBiomeに対応したらこのファイルを削除し、以下のpackage.jsonの設定を削除する
 * - "eslint"
 * - "@tanstack/eslint-plugin-query"
 */
export default [...pluginQuery.configs['flat/recommended']];
