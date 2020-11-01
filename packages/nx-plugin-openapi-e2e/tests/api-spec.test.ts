import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('api-spec e2e', () => {
  it('should create nx-plugin-openapi', async (done) => {
    const plugin = uniq('nx-plugin-openapi');
    ensureNxProject(
      '@trumbitta/nx-plugin-openapi',
      'dist/packages/nx-plugin-openapi'
    );
    await runNxCommandAsync(
      `generate @trumbitta/nx-plugin-openapi:api-spec ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Builder ran');

    done();
  }, 30000);

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-plugin-openapi');
      ensureNxProject(
        '@trumbitta/nx-plugin-openapi',
        'dist/packages/nx-plugin-openapi'
      );
      await runNxCommandAsync(
        `generate @trumbitta/nx-plugin-openapi:api-spec ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/${plugin}.openapi.yml`)
      ).not.toThrow();
      done();
    }, 30000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-plugin-openapi');
      ensureNxProject(
        '@trumbitta/nx-plugin-openapi',
        'dist/packages/nx-plugin-openapi'
      );
      await runNxCommandAsync(
        `generate @trumbitta/nx-plugin-openapi:api-spec ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    }, 30000);
  });
});