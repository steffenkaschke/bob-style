import FroalaEditor from 'froala-editor';

export const initImagesControl = () => {
  FroalaEditor.DefineIcon('imageInfo');
  FroalaEditor.RegisterCommand('imageInfo', {
    icon: 'mention',
    title: 'Image',
    focus: true,
    undo: true,
    refreshAfterCallback: false,
  });
};
