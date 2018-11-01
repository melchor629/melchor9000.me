import * as React from 'react';
import { Trans, WithNamespaces, withNamespaces } from 'react-i18next';

const AboutMe = ({ t }: WithNamespaces) => (
    <div>
        <h2 id="¿que-música-escuchas">{ t('about-me.whatMusicDoIListen.question') }</h2>
        <p>
            <Trans i18nKey="about-me.whatMusicDoIListen.answer">
                .<a href="http://www.lastfm.es/user/melchor629">.</a>.
            </Trans>
        </p>

        <h2 id="¿que-haces-ahora">{ t('about-me.whatAreYouDoingNow.question') }</h2>
        <p>{ t('about-me.whatAreYouDoingNow.answer') }</p>

        <h2 id="¿que-otras-cosas-te-gusta-hacer">{ t('about-me.whatOtherThingsDoYouLikeToDo.question') }</h2>
        <p>{ t('about-me.whatOtherThingsDoYouLikeToDo.answer') }</p>

        <h2 id="¿y-que-no">{ t('about-me.andWhatNot.question') }</h2>
        <p>{ t('about-me.andWhatNot.answer') }</p>

        <h2 id="¿que-lenguajes-de-programación-conoces">{ t('about-me.whatProgrammingLanguagesDoIKnow.question') }</h2>
        <p>
            { t('about-me.whatProgrammingLanguagesDoIKnow.answer') }
        </p>
        <ul>
            <li>
                <a href="https://www.java.com/">Java</a>
            </li>
            <li>
                JavaScript/TypeScript
            </li>
            <li>
                <a href="http://coffeescript.org/">CoffeeScript</a>
            </li>
            <li>
                C++
            </li>
            <li>
                C
            </li>
            <li>
                <a href="https://swift.org">Swift</a>
            </li>
            <li>
                <a href="https://kotlinlang.org">Kotlin</a>
            </li>
            <li>
                <a href="https://www.python.org">Python</a>
            </li>
            <li>
                <a href={'https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/' +
                'ProgrammingWithObjectiveC/Introduction/Introduction.html'}>Objective-C</a>
            </li>
            <li>
                <a href="http://haskell.org">Haskell</a>&nbsp;
                <em>{ t('about-me.whatProgrammingLanguagesDoIKnow.answerDetail1') }</em>
            </li>
            <li>
                <a href="https://www.dartlang.org/">Dart</a>&nbsp;
                <em>{ t('about-me.whatProgrammingLanguagesDoIKnow.answerDetail2') }</em>
            </li>
            <li>
                <a href="http://php.net">PHP</a>
            </li>
            <li>
                { t('about-me.whatProgrammingLanguagesDoIKnow.answerDetail3') }: ARM y MIPS
            </li>
        </ul>
        <p>
            { t('about-me.whatProgrammingLanguagesDoIKnow.answerDetail4') } CSS { t('and') } SCSS.
        </p>
        <p>
            { t('about-me.whatProgrammingLanguagesDoIKnow.answerDetail5') } <em>HTML</em> { t('and') }
            &nbsp;<em><a href="http://daringfireball.net/projects/markdown/syntax">Markdown</a></em>.
        </p>
        <p>
            { t('about-me.whatProgrammingLanguagesDoIKnow.answerDetail6') } <em><a href="http://json.org">JSON</a></em>,
            &nbsp;<em>XML</em> { t('and') } <em><a href="http://www.yaml.org">YAML</a></em>.
        </p>
        <p>
            <Trans i18nKey="about-me.whatProgrammingLanguagesDoIKnow.answerDetail7">
                .<a href="https://docker.com">.</a>.
            </Trans>
        </p>

        <h2 id="tienes">{ t('about-me.haveYouGot<>.question') }</h2>
        <p>
            { t('about-me.haveYouGot<>.answer1') } 🤔
            <br />
            { t('about-me.haveYouGot<>.answer2') }
        </p>

        <h2 id="¿tienes-un-pepino-de-pe-se">{ t('about-me.isYourComputerPowerful.question') }</h2>
        <p>{ t('about-me.isYourComputerPowerful.answer') }</p>

        <h2 id="¿tienes-un-pepino-de-movris">{ t('about-me.isYourPhonePowerful.question') }</h2>
        <p>{ t('about-me.isYourPhonePowerful.answer') }</p>

        <h2 id="¿tienes-un-pepino-de-interné">{ t('about-me.isYourNetworkConnectionSpeedy.question') }</h2>
        <p>{ t('about-me.isYourNetworkConnectionSpeedy.answer') }</p>
        <p>
            <img src="https://www.speedtest.net/result/7330550496.png" style={{ maxWidth: '100%' }} alt="Speed Test" />
        </p>

        <h2 id="quiero-saber-más...">{ t('about-me.IWannaKnowMore') }</h2>
        <p><strong>{ t('no') }.</strong> 😠</p>

        <h2 id="¿por-qué">{ t('about-me.why') }</h2>
        <p><strong>{ t('about-me.becausedont') }</strong> 😡</p>

        <h2 id="mmm">🤔</h2>
        <p><span style={{ transform: 'scale(-1, 1)', display: 'inline-block', marginLeft: '4px' }}>🤔</span></p>

    </div>
);

export default withNamespaces('translations')(AboutMe);
