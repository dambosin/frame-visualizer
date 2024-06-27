import {useFrameService} from '@/common/inversify/hooks';
import {FrameViewModel} from '@/common/services/frame-service/types';
import {useEffect, useState} from 'react';

export function useFrames(): FrameViewModel[] {
    const [frames, setFrames] = useState<FrameViewModel[]>([]);
    const frameService = useFrameService();
    useEffect(() => {
        frameService.getFrames().then((result) => setFrames(result));
    }, [frameService]);
    return frames?.length ? frames : [];
}
