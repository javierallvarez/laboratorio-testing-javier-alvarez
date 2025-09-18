import { describe, it, expect, vi } from 'vitest';
import { mapProjectFromApiToVm } from './project.mapper';
import * as apiModel from './api/project.api-model';
import * as viewModel from './project.vm';

// Mock de cada proyecto
vi.mock('./project.vm', async () => {
  const actual = await vi.importActual('./project.vm');
  return {
    ...actual,
    createEmptyProject: vi.fn().mockReturnValue({
      id: '',
      name: '',
      isActive: false,
      employees: [],
    }),
  };
});


//  En un solo describe, inlucimos tests usando toEqual, toBe, toHaveBeenCalled, mock y spyOn
describe('project.mapper specs', () => {

  // Si es null o undefined, llamammos createEmptyProject para crear un proyecto vacio
  it('should handle null and undefined values correctly', () => {
    // Arrange: Declaramos testCases con null, undefined, con datos validos y con datos invalidos
    const testCases = [
      { project: null, shouldCallEmpty: true },
      { project: undefined, shouldCallEmpty: true },
      { project: { id: 'test', name: 'test', isActive: true, employees: null }, shouldCallEmpty: false },
      { project: { id: 'test', name: 'test', isActive: true, employees: undefined }, shouldCallEmpty: false },
    ];

    // Act: Iteramos, limpiamos mocks y ejecutamos mapper
    testCases.forEach(({ project, shouldCallEmpty }) => {
      vi.clearAllMocks();

      const result = mapProjectFromApiToVm(project);
      console.log(`Result: ${JSON.stringify(result)}`);

      let totalCalls = viewModel.createEmptyProject.mock.calls.length;
      console.log(`totalCalls: ${totalCalls}`);

      // Assert: Vemos si se ha llamado a createEmptyProject
      if (shouldCallEmpty) {
        expect(result).toEqual(viewModel.createEmptyProject());
        expect(viewModel.createEmptyProject).toHaveBeenCalled();
        console.log(`createEmptyProject se ha llamado: ${totalCalls > 0}`);
      } else {
        expect(result.employees).toEqual([]);
        expect(viewModel.createEmptyProject).not.toHaveBeenCalled();
        console.log(`createEmptyProject no se ha llamado ${totalCalls === 0}`);
      }
    });
  });


  // Ver si se mapea correctamente proyectos con diferentes configuraciones
  it('should map projects with different configurations correctly', () => {
    // Arrange: Declaramos testCases con data de ejempol, con array vacio y con campos opcionales
    const testCases = [
      {
        name: 'project with employees',
        project: {
          id: 'test-id',
          name: 'test project',
          isActive: true,
          employees: [
            { id: 'emp-01', isAssigned: true, employeeName: 'Totoro' },
            { id: 'emp-02', isAssigned: false, employeeName: 'Tofu' },
          ],
        } as apiModel.Project,
        expected: {
          id: 'test-id',
          name: 'test project',
          isActive: true,
          employees: [
            { id: 'emp-01', isAssigned: true, employeeName: 'Totoro' },
            { id: 'emp-02', isAssigned: false, employeeName: 'Tofu' },
          ],
        } as viewModel.Project,
      },
      {
        name: 'project with empty employees array',
        project: {
          id: 'test-id',
          name: 'test project',
          isActive: true,
          employees: [],
        } as apiModel.Project,
        expected: {
          id: 'test-id',
          name: 'test project',
          isActive: true,
          employees: [],
        } as viewModel.Project,
      },
      {
        name: 'project with optional fields',
        project: {
          id: 'test-id',
          name: 'test project',
          externalId: 'EXT-123',
          comments: 'Test comments',
          isActive: false,
          employees: [],
        } as apiModel.Project,
        expected: {
          id: 'test-id',
          name: 'test project',
          externalId: 'EXT-123',
          comments: 'Test comments',
          isActive: false,
          employees: [],
        } as viewModel.Project,
      },
    ];

    testCases.forEach(({ name, project, expected }) => {
      console.log(`Testing: ${name}`);
      console.log(`Objeto entrada: ${JSON.stringify(project)}`);

      // Act: Iteramos y ejecutamos mapper
      const result = mapProjectFromApiToVm(project);
      console.log(`Objeto salida: ${JSON.stringify(result)}`);

      // Assert: Verificamos que sea igual al resultado esperado
      expect(result).toEqual(expected);
      console.log('Test ok!');
    });
  });


  // Verifica que no muta el objeto original y retorna nuevas instancias
  it('should not mutate original object and return new instances', () => {
    // Arrange
    const originalProject: apiModel.Project = {
      id: 'test-id',
      name: 'test project',
      isActive: true,
      employees: [{ id: 'emp-01', isAssigned: true, employeeName: 'Totoro' }],
    };
    const projectCopy = { ...originalProject };

    // Act: Ejecutamos mapper
    const result = mapProjectFromApiToVm(originalProject);
    console.log(`Objeto salida: ${JSON.stringify(result)}`);
    console.log(`Objeto original no modificado: ${JSON.stringify(originalProject)}`);

    // Assert: Verificamos que el originalProject sea igual al projectCopy y que las nuevas instancias no sean el mismo objeto
    expect(originalProject).toEqual(projectCopy);
    expect(result).not.toBe(originalProject);
    expect(result.employees).not.toBe(originalProject.employees);
    console.log('Buen test!');
  });


  // Mirar que createEmptyProject no se llama cuando hay datos válidos
  it('should not call createEmptyProject when project has valid data', () => {
    // Arrange: Declaramos project con datos validos
    const project: apiModel.Project = {
      id: 'test-id',
      name: 'test project',
      isActive: true,
      employees: [],
    };
    console.log(`Test valido: ${JSON.stringify(project)}`);

    // Clear previous calls: Limpiamos las llamadas previas
    vi.clearAllMocks();

    // Act: Ejecutamos mapper
    const result = mapProjectFromApiToVm(project);
    console.log(`Objeto salida: ${JSON.stringify(result)}`);
    let totalCalls = viewModel.createEmptyProject.mock.calls.length;
    console.log(`totalCalls: ${totalCalls}`);

    // Assert
    expect(viewModel.createEmptyProject).not.toHaveBeenCalled();
    console.log(`createEmptyProject no se ha llamado: ${totalCalls === 0}`);
  });


  // con Spy vemos comportamiento del mapper con null/undefined
  it('should verify spy behavior for null and undefined values', () => {
    // Arrange: Casos de prueba para spy
    const spyTestCases = [
      {
        name: 'null value with mock verification',
        project: null,
        mockProject: { id: 'mock', name: 'mock', isActive: false, employees: [] },
        testType: 'mock',
      },
      {
        name: 'undefined value with spyOn',
        project: undefined,
        customProject: { id: 'spy-test', name: 'spy project', isActive: true, employees: [] },
        testType: 'spyOn',
      },
    ];


    // Limpiamos mocks para cada caso de prueba
    spyTestCases.forEach(({ name, project, mockProject, customProject, testType }) => {

      vi.clearAllMocks();

      // Si es mock, mockeamos createEmptyProject para que devuelva el mockProject
      if (testType === 'mock') {
        vi.mocked(viewModel.createEmptyProject).mockReturnValue(mockProject);
        const result = mapProjectFromApiToVm(project);
        console.log(`Result es mock: ${JSON.stringify(result)}`);

        // Assert: Vemos que el resultado sea el mockProject y se haya llamado a createEmptyProject una vez
        expect(result).toBe(mockProject);
        expect(viewModel.createEmptyProject).toHaveBeenCalledOnce();
        expect(viewModel.createEmptyProject).toHaveBeenCalledWith();

        // Si es spyOn, mockeamos createEmptyProject para que devuelva el customProject y lo restauramos
      } else if (testType === 'spyOn') {
        const createEmptyProjectSpy = vi.spyOn(viewModel, 'createEmptyProject')
          .mockReturnValue(customProject);

        const result = mapProjectFromApiToVm(project);
        console.log(`Result es spyOn: ${JSON.stringify(result)}`);

        // Assert: Vemos que se haya llamado a createEmptyProject una vez y que el resultado sea el customProject
        expect(createEmptyProjectSpy).toHaveBeenCalledOnce();
        expect(createEmptyProjectSpy).toHaveBeenCalledWith();
        expect(result).toBe(customProject);
        expect(result.id).toBe('spy-test');

        // Restauramos la función original
        createEmptyProjectSpy.mockRestore();
      }
    });
  });
});
