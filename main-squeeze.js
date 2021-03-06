var MAIN_SQUEEZE_LABELS = ['None', 'A little', 'Some', 'Some more',
                           'Enough', 'More', 'Most of it', 'Lots',
                           'Heaps', 'All'];

function mainSqueezeExpansionDepth(blockEl, expansionEl) {
    var expansionDepth = 1;

    while (expansionEl.parentElement !== null
        && expansionEl.parentElement != blockEl) {
        if (expansionEl.parentElement.tagName === 'SPAN'
         && expansionEl.parentElement.classList.contains('main-squeeze-expansion')) {
            ++expansionDepth;
        }
        expansionEl = expansionEl.parentElement;
    }
    return expansionDepth;
}

function mainSqueezeSetVisibleDepth(blockEl, depth) {
    var expansionEls = blockEl.querySelectorAll('.main-squeeze-expansion');
    for (var i = 0; i < expansionEls.length; ++i) {
        var expansionEl = expansionEls[i];
        expansionDepth = mainSqueezeExpansionDepth(blockEl, expansionEl);
        if (expansionDepth <= depth) {
            expansionEl.classList.add('main-squeeze-expansion-visible');
        } else {
            expansionEl.classList.remove('main-squeeze-expansion-visible');
        }
    }
}

function mainSqueezeGetButtonLabel(i, count) {
    var labelIndex;
    if (i / count > 0.5) {
        return MAIN_SQUEEZE_LABELS[MAIN_SQUEEZE_LABELS.length - 1 - (count - i)];
    } else {
        return MAIN_SQUEEZE_LABELS[i];
    }
}

wp.domReady(function() {
    var blockEls = document.getElementsByClassName('wp-block-code');
    for (var i = 0; i < blockEls.length; ++i) {
        var blockEl = blockEls[i];

        /* We need to know how deep the expansions go in order to build the
         * slider UI. */
        var depth = 0;
        var expansionEls = blockEl.querySelectorAll('.main-squeeze-expansion');
        for (var j = 0; j < expansionEls.length; ++j) {
            var expansionEl = expansionEls[j];
            var expansionDepth = mainSqueezeExpansionDepth(blockEl, expansionEl);
            expansionEl.classList.add('main-squeeze-expansion-' + expansionDepth);
            depth = Math.max(depth, expansionDepth);
        }

        if (depth === 0) {
            /* If there are no expansions in the block, we can ignore it. */
            continue;
        }

        /* Build the expansion layer picker UI. */
        var pickerEl = document.createElement('p');
        pickerEl.classList.add('main-squeeze-picker');
        pickerEl.appendChild(document.createTextNode('Context:'));
        for (var j = 0; j <= depth; ++j) {
            (function (blockEl, j) {
                var buttonEl = document.createElement('button');
                buttonEl.innerText = mainSqueezeGetButtonLabel(j, depth);
                buttonEl.addEventListener('click', function () {
                    mainSqueezeSetVisibleDepth(blockEl, j);
                });
                pickerEl.appendChild(buttonEl);
            })(blockEl, j);
        }
        blockEl.insertAdjacentElement('afterend', pickerEl);
    }
});
