(function (wp) {
    'use strict';

    if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components) {
        return;
    }

    const el = wp.element.createElement;
    const registerBlockType = wp.blocks.registerBlockType;
    const useBlockProps = wp.blockEditor.useBlockProps;
    const InnerBlocks = wp.blockEditor.InnerBlocks;
    const InspectorControls = wp.blockEditor.InspectorControls;
    const PanelBody = wp.components.PanelBody;
    const ToggleControl = wp.components.ToggleControl;
    const __ = wp.i18n.__;

    registerBlockType('betsala/editorial', {
        edit: function (props) {
            const alt = !!props.attributes.alternateBackground;
            const blockProps = useBlockProps({
                className: 'betsala-editorial-editor' + (alt ? ' is-alt' : '')
            });

            return el(
                wp.element.Fragment,
                null,
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: __('Настройки секции', 'betsala'), initialOpen: true },
                        el(ToggleControl, {
                            label: __('Альтернативный фон', 'betsala'),
                            checked: alt,
                            onChange: function (value) {
                                props.setAttributes({ alternateBackground: !!value });
                            }
                        })
                    )
                ),
                el(
                    'div',
                    blockProps,
                    el(
                        'div',
                        { className: 'betsala-editorial-editor__label' },
                        __('Текстовый раздел BetSala — вставьте готовый текст целиком', 'betsala')
                    ),
                    el(
                        InnerBlocks,
                        {
                            template: [
                                ['core/paragraph', { placeholder: __('Вставьте сюда H2/H3, абзацы, список или таблицу…', 'betsala') }]
                            ],
                            templateLock: false,
                            allowedBlocks: [
                                'core/heading',
                                'core/paragraph',
                                'core/list',
                                'core/table',
                                'core/quote',
                                'core/buttons',
                                'core/button',
                                'core/separator',
                                'core/image',
                                'core/group'
                            ]
                        }
                    )
                )
            );
        },
        save: function () {
            return el(InnerBlocks.Content);
        }
    });
})(window.wp);
