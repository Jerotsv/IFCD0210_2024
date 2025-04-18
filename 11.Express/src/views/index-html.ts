import { renderHeader } from './partials/header.js';
import { renderHead } from './partials/head.js';
import { renderFooter } from './partials/footer.js';
import { renderDialogNav } from './partials/dialog-nav.js';

export const renderIndexHtml = () => {
    const title = 'Inicio | Express Demo';
    const pageTitle = 'Express Demo';

    const html = String.raw;

    return html`
        <!DOCTYPE html>
        <html lang="en">
            ${renderHead(title)}
            <body>
                ${renderHeader(pageTitle)} ${renderDialogNav()}

                <main>
                    <section>
                        <button>Cargar datos</button>
                    </section>
                    <section>
                        <h2>Texto lorem</h2>
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Molestiae alias odio distinctio qui,
                            cupiditate autem eos? Voluptate beatae molestias
                            dignissimos doloremque similique recusandae porro
                            ducimus perferendis accusamus? Ea, laborum sint.
                        </p>
                        <p>
                            Voluptatum, nobis ex! Dignissimos aut possimus
                            laudantium quo esse voluptates aperiam, earum
                            molestias! Aspernatur in nisi suscipit nostrum eaque
                            iste, sit odio maxime voluptatum. Atque reiciendis
                            eum impedit aut similique.
                        </p>
                        <p>
                            Labore quas voluptates unde vero ullam voluptatibus
                            reiciendis sequi eius, esse doloribus. Beatae,
                            voluptatibus, libero eos at asperiores eius ut
                            blanditiis aliquam rem voluptatum nisi aspernatur
                            odio, veniam consequuntur maiores.
                        </p>
                        <p>
                            Rem aperiam ab molestias voluptatem tempora cumque
                            beatae debitis eius omnis iste quia at ipsum minima
                            suscipit voluptates perferendis accusantium optio
                            illo in, quos mollitia necessitatibus libero? Ad,
                            beatae quisquam?
                        </p>
                        <p>
                            Consequuntur voluptatem minus ad modi magni eum
                            nesciunt exercitationem voluptatum debitis
                            perferendis cum architecto nisi non quisquam,
                            aliquid deleniti odio, atque incidunt cupiditate?
                            Voluptates minima exercitationem ex aut autem vero?
                        </p>
                        <p>
                            Tempora totam sapiente consequatur placeat, corporis
                            sit quo maxime facere dolorem vitae voluptatibus
                            dolore aut veritatis eaque deserunt hic esse alias
                            numquam, iusto eligendi sint cum, ducimus ad
                            nostrum! Voluptatum!
                        </p>
                        <p>
                            Consequatur, id iure ipsam quos quibusdam aut
                            voluptas dolore sint quia sapiente similique velit!
                            Sequi hic fugiat nesciunt nobis eos aperiam deserunt
                            ratione quas alias, labore rem nisi incidunt iusto.
                        </p>
                        <p>
                            Sed, debitis quae earum eaque quod similique itaque,
                            vero amet, obcaecati animi fugiat! Perferendis dolor
                            repudiandae voluptas incidunt, sunt ea nemo
                            provident porro magnam id, aliquam voluptatibus
                            exercitationem quae reiciendis.
                        </p>
                        <p>
                            Dolor, dolores delectus? Distinctio aliquam id
                            facere quisquam perspiciatis at qui cum beatae
                            laboriosam minima. Quibusdam, voluptatum ut.
                            Cupiditate quo perspiciatis suscipit maxime
                            provident tenetur ab expedita tempore vel.
                            Consequuntur?
                        </p>
                        <p>
                            Commodi fuga illo numquam assumenda quae, voluptatum
                            facilis molestiae dolore architecto iste in magni
                            qui voluptates, incidunt esse error similique ea
                            tempora, odio sed inventore! Hic libero impedit quas
                            voluptatem.
                        </p>
                    </section>
                </main>
                ${renderFooter()}
            </body>
        </html>
    `;
};
