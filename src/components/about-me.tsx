import React from 'react'
import { Trans, WithTranslation, withTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Link as RouterLink } from 'react-router-dom'

const Link = React.memo(({ children, href }: any) => (
    <a href={href} rel="noreferrer noopener">{children}</a>
))

const image = [
    {
        src: '/img/itsame/raul.jpg',
        photographer: 'Raúl',
        photographerLink: 'https://twitter.com/MrRaulWhite',
    },
    {
        src: '/img/itsame/manu.jpg',
        photographer: 'Manu',
        photographerLink: 'https://twitter.com/_M1ndbl0w',
    },
][Math.trunc(Math.random() * 2)]

const AboutMe = ({ t }: WithTranslation) => (
    <>

        <Helmet>
            <title>{t('about-me.title')}</title>
            <meta name="Description" content={t('about-me.description')} />
        </Helmet>

        <h1 className="display-4 text-center d-none d-sm-block">
            <Trans i18nKey="about-me.page-heading">
                Soy <b>melchor629</b> (aka <b>melchor9000</b>)
            </Trans>
        </h1>
        <h1 className="d-sm-none text-center">
            <Trans i18nKey="about-me.page-heading">
                Soy <b>melchor629</b> (aka <b>melchor9000</b>)
            </Trans>
        </h1>

        <p className="lead mb-4 text-center">
            <Trans i18nKey="about-me.page-subheading">
                .<em>.</em>.
            </Trans>
        </p>

        <figure className="figure">
            <img src={image.src} className="figure-img img-fluid rounded" alt={`It's me (📷 ${image.photographer})`} />
            <figcaption className="figure-caption text-right">
                It's me -&nbsp;
                <Link href={image.photographerLink}>
                    <span role="img" aria-label="Camera emoji">📷</span>
                    &nbsp;
                    {image.photographer}
                </Link>
            </figcaption>
        </figure>

        <h2 className="mt-4">{t('about-me.programmer.heading')}</h2>

        <p className="lead">
            <Trans i18nKey="about-me.programmer.p1">.</Trans>
        </p>

        <p className="lead">
            <Trans i18nKey="about-me.programmer.p2">.<em>.</em>.</Trans>
        </p>

        <p className="lead">
            <Trans i18nKey="about-me.programmer.p3">.</Trans>
        </p>

        <h2 className="mt-4">{t('about-me.sysadmin.heading')}</h2>

        <p className="lead">
            <Trans i18nKey="about-me.sysadmin.p1">.</Trans>
        </p>

        <p className="lead">
            <Trans i18nKey="about-me.sysadmin.p2">
                .<Link href="https://antonioangel.xyz">Antonio</Link>.<em>Redes</em>.
            </Trans>
        </p>

        <p className="lead">
            <Trans i18nKey="about-me.sysadmin.p3">
                .<Link href="https://casita.melchor9000.me">.</Link>.
            </Trans>
        </p>

        <h2 className="mt-4">{t('about-me.devops.heading')}</h2>

        <p className="lead">
            <Trans i18nKey="about-me.devops.p1">
                .<em>.</em>.<em>.</em>.
                <Link href="https://www.jenkins.io">Jenkins</Link>
                .
                <Link href="https://www.docker.com">Docker</Link>
                .
                <Link href="https://www.amgxv.com">Andrés</Link>
                .
                <Link href="https://majorcadevs.com">MajorcaDevs</Link>
                .
                <Link href="https://kubernetes.io">Kubernetes</Link>
                .
            </Trans>
        </p>

        <h2 className="mt-4">{t('about-me.photography.heading')}</h2>

        <p className="lead">
            <Trans i18nKey="about-me.photography.p1">
                .<Link href="https://en.wikipedia.org/wiki/Canon_EOS_400D">Canon 400D</Link>
                .
                <Link href="https://en.wikipedia.org/wiki/Canon_EOS_1300D">Canon 1300D</Link>
                .
            </Trans>
        </p>

        <p className="lead">
            <Trans i18nKey="about-me.photography.p2">
                .<RouterLink to="/gallery">la galería de esta web</RouterLink>.
            </Trans>
        </p>

        <h2 className="mt-4 text-center">
            {t('about-me.page-footer')}
        </h2>

        <h2 className="mt-4 mb-5 text-center"><span role="img" aria-label="thinking emoji">🤔</span></h2>

    </>
)

export default withTranslation('translations')(AboutMe)
