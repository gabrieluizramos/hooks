import { renderHook, act, fireEvent } from '@testing-library/react-hooks'

import { keys, code } from '../use-konami-code/config';
import useKonamiCode from '../use-konami-code';

describe('useKonamiCode', () => {
    it('Should dispatch callback fn after typing correctly sequence of konami', async () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useKonamiCode(callback));
        expect(callback).toHaveBeenCalledTimes(0);

        code.forEach(keyCode => act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keys[keyCode] }));
        }));

        expect(callback).toHaveBeenCalledTimes(1);
    });
});