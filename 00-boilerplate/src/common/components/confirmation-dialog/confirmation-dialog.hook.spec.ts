import { renderHook, act } from '@testing-library/react';
import { useConfirmationDialog } from './confirmation-dialog.hook';
import { createEmptyLookup, Lookup } from '#common/models';

describe('useConfirmationDialog hook specs', () => {

  // Ver si se abre el dialog y se establece el item que se va a borrar
  it('should open dialog and set item when onOpenDialog is called', () => {
    // Arrange: Declaro item que se va a borrar
    const testItem: Lookup = {
      id: 'test-id',
      name: 'Item molón'
    };
    const { result } = renderHook(() => useConfirmationDialog());
    console.log('Item a borrar:', JSON.stringify(testItem));

    // Act: Llamamos a onOpenDialog para abrir el diálogo de confirmación
    act(() => {
      result.current.onOpenDialog(testItem);
    });

    // Assert: Verificamos que el diálogo se abra y el item a borrar se establezca
    expect(result.current.isOpen).toBe(true);
    expect(result.current.itemToDelete).toEqual(testItem);
    console.log('Dialog abierto e item a borrar establecido');
    console.log('Test OK!');
  });


  // Ver si se cierra el diálogo cuando cancelamos la eliminación
  it('should close dialog when onClose is called', () => {
    // Arrange: Inicializamos el hook y abrimos el diálogo de confirmación
    const testItem: Lookup = {
      id: 'test-id',
      name: 'Item no tan molón'
    };
    const { result } = renderHook(() => useConfirmationDialog());

    act(() => {
      result.current.onOpenDialog(testItem);
    });
    console.log('Dialog abierto');

    // Act: Llamamos a onClose (usuario cancela la eliminación)
    act(() => {
      result.current.onClose();
    });
    console.log('onClose - usuario cancela');

    // Assert: Verificamos que el diálogo se cierre y que el item a borrar se conserve
    expect(result.current.isOpen).toBe(false);
    expect(result.current.itemToDelete).toEqual(testItem);
    console.log('Dialog cerrado - item no se ha borrado');
  });


  // Se borra el item después de confirmar la eliminación
  it('should clear item when onAccept is called', () => {
    // Arrange: Inicializamos el hook y abrimos el dialog de confirmación
    const testItem: Lookup = {
      id: 'test-id',
      name: 'Item que era molón'
    };
    const { result } = renderHook(() => useConfirmationDialog());

    act(() => {
      result.current.onOpenDialog(testItem);
    });
    console.log('Dialog abierto con item a borrar:', JSON.stringify(testItem));

    // Act: onAccept - user confirma la eliminación
    act(() => {
      result.current.onAccept();
    });
    console.log('onAccept - Houston, confirmamos eliminación');

    // Assert: Verificamos el borrado - ese item ya no existe y el dialog sigue abierto
    expect(result.current.itemToDelete).toEqual(createEmptyLookup());
    expect(result.current.isOpen).toBe(true);
    console.log('Item borrado y dialog abierto');
    console.log('Test OK!');
  });

});
